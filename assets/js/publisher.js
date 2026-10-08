// 글+이미지를 Git Data API로 한 커밋에 게시한다 (blob → tree → commit → ref 갱신).
// 한 커밋으로 올리면 Actions가 한 번만 실행되어 파일별 커밋의 중복 실행·충돌을 피한다.

const Publisher = (() => {
    class PublishError extends Error {
        constructor(message, status) {
            super(message);
            this.status = status;
        }
    }

    // UTF-8 문자열 → base64
    function textToBase64(text) {
        return bytesToBase64(new TextEncoder().encode(text));
    }

    function bytesToBase64(bytes) {
        let binary = '';
        const chunk = 0x8000;
        for (let i = 0; i < bytes.length; i += chunk) {
            binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
        }
        return btoa(binary);
    }

    function describeError(status) {
        if (status === 401) return '토큰이 만료되었거나 유효하지 않습니다. 다시 로그인하세요.';
        if (status === 403) return '이 토큰에는 저장소 쓰기 권한이 없습니다. (Contents: Read and write 필요)';
        if (status === 404) return '저장소 또는 대상을 찾을 수 없습니다. 토큰의 저장소 접근 범위를 확인하세요.';
        if (status === 422) return '요청이 거부되었습니다. (이미 있는 글이거나 충돌)';
        return `GitHub 응답 오류 (${status})`;
    }

    // api(path, options) → Response. 기본은 Auth.apiFetch.
    function create(api = (path, options) => Auth.apiFetch(path, options)) {
        const repoPath = `/repos/${Auth.OWNER}/${Auth.REPO}`;

        async function call(path, options, okStatuses = [200, 201]) {
            const res = await api(path, options);
            if (!okStatuses.includes(res.status)) {
                throw new PublishError(describeError(res.status), res.status);
            }
            return res.status === 204 ? null : res.json();
        }

        function jsonBody(method, body) {
            return { method, body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } };
        }

        // 경로가 이미 저장소에 있는지 (404 이외의 오류는 예외)
        async function exists(path, branch) {
            const res = await api(`${repoPath}/contents/${path}?ref=${encodeURIComponent(branch)}`);
            if (res.status === 404) return false;
            if (res.status === 200) return true;
            throw new PublishError(describeError(res.status), res.status);
        }

        // post: { project, slug, title, markdown, images: [{ name, base64 }] }
        async function publish(post, onProgress = () => {}) {
            const repo = await call(repoPath);
            const branch = repo.default_branch;

            onProgress('중복 확인 중...');
            const dirPath = `mdposts/${post.project}/${post.slug}`;
            if (await exists(dirPath, branch) || await exists(`${dirPath}.md`, branch)) {
                throw new PublishError(`이미 같은 slug(${post.slug})의 글이 저장소에 있습니다.`, 422);
            }

            // 파일마다 blob 생성
            const files = [{ path: `${dirPath}/index.md`, base64: textToBase64(post.markdown) }]
                .concat(post.images.map(image => ({ path: `${dirPath}/${image.name}`, base64: image.base64 })));

            const entries = [];
            for (let i = 0; i < files.length; i++) {
                onProgress(`파일 업로드 중... (${i + 1}/${files.length})`);
                const blob = await call(`${repoPath}/git/blobs`,
                    jsonBody('POST', { content: files[i].base64, encoding: 'base64' }));
                entries.push({ path: files[i].path, mode: '100644', type: 'blob', sha: blob.sha });
            }

            // 최신 커밋 위에 새 커밋을 만든다. Actions 봇 커밋 등으로 ref가 앞서 나갔으면 한 번 재시도.
            for (let attempt = 0; attempt < 2; attempt++) {
                onProgress('커밋 생성 중...');
                const ref = await call(`${repoPath}/git/ref/heads/${branch}`);
                const parent = await call(`${repoPath}/git/commits/${ref.object.sha}`);
                const tree = await call(`${repoPath}/git/trees`,
                    jsonBody('POST', { base_tree: parent.tree.sha, tree: entries }));
                const commit = await call(`${repoPath}/git/commits`,
                    jsonBody('POST', {
                        message: `글 게시: ${post.title}`,
                        tree: tree.sha,
                        parents: [ref.object.sha]
                    }));

                const res = await api(`${repoPath}/git/refs/heads/${branch}`,
                    jsonBody('PATCH', { sha: commit.sha, force: false }));
                if (res.status === 200) {
                    return { commitUrl: commit.html_url, commitSha: commit.sha };
                }
                if (res.status !== 422 || attempt === 1) {
                    throw new PublishError(describeError(res.status), res.status);
                }
            }
        }

        return { publish };
    }

    return { create, PublishError, textToBase64, bytesToBase64 };
})();
