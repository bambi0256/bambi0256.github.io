// 글 작성에 쓰는 순수 로직 (DOM·네트워크 의존 없음): 검증, 파일명 정리, Front Matter 생성 등

const PostLib = (() => {
    const SLUG_PATTERN = /^[a-z0-9][a-z0-9_-]*$/;
    const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
    const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    // Date → 'YYYY-MM-DD' (로컬 시간)
    function formatDate(date) {
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }

    function isValidDate(value) {
        if (!DATE_PATTERN.test(value)) return false;
        const [y, m, d] = value.split('-').map(Number);
        const date = new Date(y, m - 1, d);
        return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
    }

    // 'YYYYMMDDNN': 같은 날짜로 시작하는 기존 slug 수 + 1
    function suggestSlug(dateString, existingSlugs) {
        const prefix = dateString.replace(/-/g, '');
        const count = existingSlugs.filter(slug => slug.startsWith(prefix)).length;
        return `${prefix}${pad(count + 1)}`;
    }

    // 쉼표로 구분된 태그 문자열 → 배열
    function parseTags(text) {
        return text.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }

    function getExtension(filename) {
        const index = filename.lastIndexOf('.');
        return index < 0 ? '' : filename.slice(index + 1).toLowerCase();
    }

    // 파일명 정리: 소문자·숫자·'-'·'_'·'.' 만 남기고, 이미 쓰인 이름이면 번호를 붙인다.
    function sanitizeFilename(filename, usedNames) {
        const ext = getExtension(filename);
        const base = filename.slice(0, filename.length - (ext ? ext.length + 1 : 0))
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9_-]/g, '')
            .replace(/^[-_]+/, '') || 'image';

        let name = `${base}.${ext}`;
        let n = 2;
        while (usedNames.includes(name)) {
            name = `${base}-${n}.${ext}`;
            n++;
        }
        return name;
    }

    // 이미지 파일 검증: 오류 메시지 또는 null
    function validateImageFile(filename, size) {
        if (!IMAGE_EXTENSIONS.includes(getExtension(filename))) {
            return `${filename}: jpg, png, gif, webp 만 업로드할 수 있습니다.`;
        }
        if (size > MAX_IMAGE_BYTES) {
            return `${filename}: 파일당 5MB 이하만 업로드할 수 있습니다.`;
        }
        return null;
    }

    // Markdown 본문에서 이미지 경로 추출 (![alt](path "title") 형태)
    function extractImageRefs(body) {
        const refs = [];
        const pattern = /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;
        let match;
        while ((match = pattern.exec(body)) !== null) {
            refs.push(match[1]);
        }
        return refs;
    }

    function isRelativePath(path) {
        return !/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(path);
    }

    // 게시 전 검증: { errors: [], warnings: [] }
    // post: { project, newProject, title, date, slug, mainImage, tags, excerpt, body }
    //   newProject: 새 프로젝트를 만들 때 { title, description }, 기존 프로젝트면 null (이때 project 는 새 프로젝트의 slug)
    // context: { projects: [slug], existingSlugs: [slug], imageNames: [name] }
    function validatePost(post, context) {
        const errors = [];
        const warnings = [];

        if (post.newProject) {
            if (!SLUG_PATTERN.test(post.project)) {
                errors.push('프로젝트 slug는 영문 소문자·숫자·하이픈(-)·밑줄(_)만 쓸 수 있고, 영문/숫자로 시작해야 합니다.');
            } else if (context.projects.includes(post.project)) {
                errors.push(`이미 같은 slug(${post.project})의 프로젝트가 있습니다.`);
            }
            if (!post.newProject.title.trim()) errors.push('프로젝트 이름을 입력하세요.');
        } else if (!post.project || !context.projects.includes(post.project)) {
            errors.push('프로젝트를 선택하세요.');
        }
        if (!post.title.trim()) errors.push('제목을 입력하세요.');
        if (!post.excerpt.trim()) errors.push('요약(excerpt)을 입력하세요.');
        if (post.tags.length === 0) errors.push('태그를 하나 이상 입력하세요.');
        if (!post.body.trim()) errors.push('본문을 입력하세요.');

        if (!isValidDate(post.date)) errors.push('날짜는 YYYY-MM-DD 형식의 올바른 날짜여야 합니다.');

        if (!SLUG_PATTERN.test(post.slug)) {
            errors.push('slug는 영문 소문자·숫자·하이픈(-)·밑줄(_)만 쓸 수 있고, 영문/숫자로 시작해야 합니다.');
        } else if (context.existingSlugs.includes(post.slug)) {
            errors.push(`이 프로젝트에 이미 같은 slug(${post.slug})의 글이 있습니다.`);
        }

        if (!post.mainImage) {
            errors.push('대표 이미지를 선택하거나 경로를 입력하세요.');
        } else if (isRelativePath(post.mainImage)) {
            if (!context.imageNames.includes(post.mainImage)) {
                errors.push(`대표 이미지(${post.mainImage})가 업로드한 이미지에 없습니다.`);
            }
        } else if (!post.mainImage.startsWith('/assets/image/')) {
            warnings.push('대표 이미지 경로가 /assets/image/ 로 시작하지 않습니다. 파일이 실제로 있는지 확인하세요.');
        }

        const referenced = extractImageRefs(post.body).filter(isRelativePath);
        referenced.forEach(ref => {
            if (!context.imageNames.includes(ref)) {
                warnings.push(`본문의 이미지(${ref})가 업로드한 이미지에 없습니다.`);
            }
        });
        context.imageNames.forEach(name => {
            if (name !== post.mainImage && !referenced.includes(name)) {
                warnings.push(`업로드한 이미지(${name})가 본문·대표 이미지에서 쓰이지 않습니다.`);
            }
        });

        return { errors, warnings };
    }

    // Front Matter + 본문. JSON 문자열은 YAML 큰따옴표 문자열로도 유효하다.
    function buildMarkdown(post) {
        const lines = [
            '---',
            `title: ${JSON.stringify(post.title.trim())}`,
            `date: ${JSON.stringify(post.date)}`,
            `slug: ${JSON.stringify(post.slug)}`,
            `main_image: ${JSON.stringify(post.mainImage)}`,
            `tags: ${JSON.stringify(post.tags)}`,
            `excerpt: ${JSON.stringify(post.excerpt.trim())}`
        ];
        // 새 프로젝트의 첫 글에는 프로젝트 이름·설명을 함께 기록한다 (빌드가 이 값으로 프로젝트를 만든다)
        if (post.newProject) {
            lines.push(`project_title: ${JSON.stringify(post.newProject.title.trim())}`);
            if (post.newProject.description.trim()) {
                lines.push(`project_description: ${JSON.stringify(post.newProject.description.trim())}`);
            }
        }
        lines.push('---', '', post.body.replace(/\r\n/g, '\n').trim(), '');
        return lines.join('\n');
    }

    // 게시 후 접근 경로
    function postUrl(project, slug) {
        return `/projects/${project}/${slug}/`;
    }

    // 저장소 내 글 경로
    function postRepoPath(project, slug) {
        return `mdposts/${project}/${slug}/index.md`;
    }

    function imageRepoPath(project, slug, name) {
        return `mdposts/${project}/${slug}/${name}`;
    }

    return {
        MAX_IMAGE_BYTES, IMAGE_EXTENSIONS,
        formatDate, isValidDate, suggestSlug, parseTags,
        sanitizeFilename, validateImageFile,
        extractImageRefs, isRelativePath,
        validatePost, buildMarkdown,
        postUrl, postRepoPath, imageRepoPath
    };
})();
