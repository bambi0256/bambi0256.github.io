// 블로그 주인 검증: Fine-grained PAT로 GitHub API를 호출해 계정과 저장소 쓰기 권한을 확인한다.
// 토큰은 sessionStorage에만 저장한다 (탭을 닫으면 삭제, 저장소에 커밋되지 않음).
// 실제 쓰기 권한은 GitHub가 토큰으로 강제하므로, 이 검증은 UI 접근 제어 + 사전 확인 용도다.

const Auth = (() => {
    const OWNER = 'bambi0256';
    const REPO = 'bambi0256.github.io';
    const API = 'https://api.github.com';
    const TOKEN_KEY = 'bbee.token';

    function getToken() {
        try {
            return sessionStorage.getItem(TOKEN_KEY);
        } catch (e) {
            return null;
        }
    }

    function setToken(token) {
        sessionStorage.setItem(TOKEN_KEY, token);
    }

    function clear() {
        try {
            sessionStorage.removeItem(TOKEN_KEY);
        } catch (e) { /* 무시 */ }
    }

    // 인증 헤더를 붙인 GitHub API 호출 (path는 '/user' 같은 API 경로)
    function apiFetch(path, options = {}, token = getToken()) {
        return fetch(`${API}${path}`, {
            ...options,
            headers: {
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'Authorization': `Bearer ${token}`,
                ...(options.headers || {})
            }
        });
    }

    // 토큰 검증: { ok, login, reason }
    async function verify(token = getToken()) {
        if (!token) return { ok: false, reason: '토큰이 없습니다.' };

        try {
            const userRes = await apiFetch('/user', {}, token);
            if (userRes.status === 401) return { ok: false, reason: '유효하지 않은 토큰입니다.' };
            if (!userRes.ok) return { ok: false, reason: `GitHub 응답 오류 (${userRes.status})` };

            const user = await userRes.json();
            if (user.login !== OWNER) {
                return { ok: false, login: user.login, reason: '블로그 주인 계정이 아닙니다.' };
            }

            const repoRes = await apiFetch(`/repos/${OWNER}/${REPO}`, {}, token);
            if (!repoRes.ok) return { ok: false, login: user.login, reason: '저장소에 접근할 수 없는 토큰입니다.' };

            const repo = await repoRes.json();
            if (!(repo.permissions && repo.permissions.push)) {
                return { ok: false, login: user.login, reason: '저장소 쓰기 권한이 없는 토큰입니다.' };
            }

            // permissions.push 는 계정의 권한이라 토큰의 Contents 쓰기 권한을 보장하지 않는다.
            // 내용이 비어 있는 blob(저장소에 남지 않는 고정 객체) 생성으로 토큰의 쓰기 권한을 확인한다.
            const probeRes = await apiFetch(`/repos/${OWNER}/${REPO}/git/blobs`, {
                method: 'POST',
                body: JSON.stringify({ content: '', encoding: 'utf-8' }),
                headers: { 'Content-Type': 'application/json' }
            }, token);
            if (probeRes.status === 403 || probeRes.status === 404) {
                return { ok: false, login: user.login, reason: '토큰에 이 저장소의 Contents: Read and write 권한이 없습니다. 토큰 설정을 확인하세요.' };
            }
            if (!probeRes.ok) return { ok: false, login: user.login, reason: `쓰기 권한 확인 실패 (${probeRes.status})` };

            return { ok: true, login: user.login };
        } catch (e) {
            return { ok: false, reason: '네트워크 오류로 검증하지 못했습니다.' };
        }
    }

    return { OWNER, REPO, getToken, setToken, clear, apiFetch, verify };
})();
