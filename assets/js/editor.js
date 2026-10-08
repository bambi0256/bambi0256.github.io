// 글 작성 UI: 폼, 이미지(브라우저 메모리 보관), 미리보기, 게시

const Editor = (() => {
    const CUSTOM_COVER = '__custom__';
    const PREVIEW_STYLE = `
        body { font-family: sans-serif; line-height: 1.7; color: #343434; padding: 0 12px; }
        img { max-width: 100%; }
        pre { background: #272822; color: #f8f8f2; padding: 12px; overflow-x: auto; border-radius: 6px; }
        code { background: #f3f3f3; padding: 1px 4px; border-radius: 4px; }
        pre code { background: none; padding: 0; }
        blockquote { border-left: 4px solid #FFDE59; margin: 0; padding-left: 12px; color: #666; }
        table { border-collapse: collapse; } td, th { border: 1px solid #ccc; padding: 4px 8px; }
    `;

    let initialized = false;
    let projectsData = [];
    let images = [];          // { name, file, dataUrl }
    let slugEdited = false;   // 사용자가 slug를 직접 수정했는지
    let published = false;
    let previewTimer = null;

    const el = {};

    function $(id) {
        return document.getElementById(id);
    }

    // ---------- 프로젝트 / slug ----------

    async function loadProjects() {
        try {
            const res = await fetch('/json/projects-metadata.json', { cache: 'no-cache' });
            projectsData = res.ok ? await res.json() : [];
        } catch (e) {
            projectsData = [];
        }

        el.project.innerHTML = '';
        projectsData.forEach(({ config }) => {
            const option = document.createElement('option');
            option.value = config.slug;
            option.textContent = config.title;
            el.project.appendChild(option);
        });
    }

    function existingSlugs(project) {
        const data = projectsData.find(p => p.config.slug === project);
        return data ? data.posts.map(post => post.slug) : [];
    }

    function refreshSlugSuggestion() {
        if (slugEdited) return;
        el.slug.value = PostLib.suggestSlug(el.date.value, existingSlugs(el.project.value));
    }

    // ---------- 이미지 ----------

    function readAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    async function addImages(fileList) {
        const messages = [];
        for (const file of fileList) {
            const error = PostLib.validateImageFile(file.name, file.size);
            if (error) {
                messages.push(error);
                continue;
            }
            const name = PostLib.sanitizeFilename(file.name, images.map(image => image.name));
            images.push({ name, file, dataUrl: await readAsDataUrl(file) });
        }
        el.imageInput.value = '';
        renderImages();
        if (messages.length > 0) showMessages(messages, []);
        schedulePreview();
    }

    function removeImage(name) {
        images = images.filter(image => image.name !== name);
        renderImages();
        schedulePreview();
    }

    function insertAtCursor(textarea, text) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.slice(0, start) + text + textarea.value.slice(end);
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.focus();
        schedulePreview();
    }

    function renderImages() {
        el.imageList.innerHTML = '';
        images.forEach(image => {
            const item = document.createElement('li');

            const thumb = document.createElement('img');
            thumb.src = image.dataUrl;
            thumb.alt = image.name;

            const label = document.createElement('span');
            label.textContent = image.name;

            const insert = document.createElement('button');
            insert.type = 'button';
            insert.textContent = '본문에 삽입';
            insert.addEventListener('click', () => insertAtCursor(el.body, `![${image.name}](${image.name})`));

            const remove = document.createElement('button');
            remove.type = 'button';
            remove.textContent = '제거';
            remove.addEventListener('click', () => removeImage(image.name));

            item.append(thumb, label, insert, remove);
            el.imageList.appendChild(item);
        });
        renderCoverOptions();
    }

    function renderCoverOptions() {
        const previous = el.cover.value;
        el.cover.innerHTML = '';

        const addOption = (value, text) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            el.cover.appendChild(option);
        };
        addOption('', '(선택)');
        images.forEach(image => addOption(image.name, image.name));
        addOption(CUSTOM_COVER, '직접 입력 (/assets/image/... 경로)');

        const stillExists = Array.from(el.cover.options).some(option => option.value === previous);
        el.cover.value = stillExists ? previous : '';
        el.coverPath.hidden = el.cover.value !== CUSTOM_COVER;
    }

    // ---------- 폼 값 ----------

    function getPost() {
        const cover = el.cover.value === CUSTOM_COVER ? el.coverPath.value.trim() : el.cover.value;
        return {
            project: el.project.value,
            title: el.title.value,
            date: el.date.value,
            slug: el.slug.value.trim(),
            mainImage: cover,
            tags: PostLib.parseTags(el.tags.value),
            excerpt: el.excerpt.value,
            body: el.body.value
        };
    }

    function getContext(post) {
        return {
            projects: projectsData.map(p => p.config.slug),
            existingSlugs: existingSlugs(post.project),
            imageNames: images.map(image => image.name)
        };
    }

    function showMessages(errors, warnings) {
        el.messages.innerHTML = '';
        errors.forEach(text => {
            const item = document.createElement('li');
            item.className = 'error';
            item.textContent = text;
            el.messages.appendChild(item);
        });
        warnings.forEach(text => {
            const item = document.createElement('li');
            item.className = 'warning';
            item.textContent = `주의: ${text}`;
            el.messages.appendChild(item);
        });
    }

    // ---------- 미리보기 ----------

    function renderPreviewHtml(body) {
        const html = marked.parse(body, { gfm: true });
        const doc = new DOMParser().parseFromString(html, 'text/html');
        doc.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            const image = images.find(item => item.name === src);
            if (image) img.setAttribute('src', image.dataUrl);
        });
        return doc.body.innerHTML;
    }

    function updatePreview() {
        const post = getPost();
        const content = renderPreviewHtml(post.body);
        const cover = images.find(image => image.name === post.mainImage);
        const header = `<h1>${escapeHtml(post.title)}</h1>` +
            (cover ? `<img src="${cover.dataUrl}" alt="">` : '');
        el.preview.srcdoc = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${PREVIEW_STYLE}</style></head>` +
            `<body>${header}${content}</body></html>`;
    }

    function schedulePreview() {
        clearTimeout(previewTimer);
        previewTimer = setTimeout(updatePreview, 250);
    }

    function escapeHtml(text) {
        return text.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    }

    // ---------- 게시 ----------

    async function toBase64(file) {
        return Publisher.bytesToBase64(new Uint8Array(await file.arrayBuffer()));
    }

    function setStatus(text, isError) {
        el.status.textContent = text;
        el.status.classList.toggle('error', Boolean(isError));
    }

    function resetForm() {
        el.form.reset();
        images = [];
        slugEdited = false;
        el.date.value = PostLib.formatDate(new Date());
        renderImages();
        refreshSlugSuggestion();
        updatePreview();
    }

    async function onSubmit(event) {
        event.preventDefault();
        setStatus('', false);

        const post = getPost();
        const { errors, warnings } = PostLib.validatePost(post, getContext(post));
        showMessages(errors, warnings);
        if (errors.length > 0) return;

        el.publish.disabled = true;
        try {
            const result = await Publisher.create().publish({
                project: post.project,
                slug: post.slug,
                title: post.title.trim(),
                markdown: PostLib.buildMarkdown(post),
                images: await Promise.all(images.map(async image => ({
                    name: image.name,
                    base64: await toBase64(image.file)
                })))
            }, text => setStatus(text, false));

            published = true;
            const url = PostLib.postUrl(post.project, post.slug);
            resetForm();
            showMessages([], []);
            setStatus(`게시했습니다. 빌드·배포 후(보통 1~2분) ${url} 에 반영됩니다.`, false);
            console.info('Published:', result.commitUrl);
        } catch (e) {
            const message = e instanceof Publisher.PublishError ? e.message : '게시 중 오류가 발생했습니다.';
            setStatus(message, true);
        } finally {
            el.publish.disabled = false;
        }
    }

    function hasUnsavedWork() {
        return !published && (images.length > 0 || el.title.value.trim() !== '' || el.body.value.trim() !== '');
    }

    // ---------- 초기화 ----------

    async function init() {
        if (initialized) return;
        initialized = true;

        Object.assign(el, {
            form: $('post-form'), project: $('field-project'), title: $('field-title'),
            date: $('field-date'), slug: $('field-slug'), tags: $('field-tags'),
            excerpt: $('field-excerpt'), body: $('field-body'),
            imageInput: $('image-input'), imageList: $('image-list'),
            cover: $('field-cover'), coverPath: $('field-cover-path'),
            messages: $('validation-messages'), publish: $('publish-button'),
            status: $('publish-status'), preview: $('preview-frame')
        });

        await loadProjects();
        el.date.value = PostLib.formatDate(new Date());
        renderImages();
        refreshSlugSuggestion();
        updatePreview();

        el.project.addEventListener('change', refreshSlugSuggestion);
        el.date.addEventListener('change', refreshSlugSuggestion);
        el.slug.addEventListener('input', () => { slugEdited = true; });
        el.cover.addEventListener('change', () => {
            el.coverPath.hidden = el.cover.value !== CUSTOM_COVER;
            schedulePreview();
        });
        [el.title, el.body].forEach(input => input.addEventListener('input', () => {
            published = false;
            schedulePreview();
        }));
        el.imageInput.addEventListener('change', () => addImages(Array.from(el.imageInput.files)));
        el.form.addEventListener('submit', onSubmit);

        window.addEventListener('beforeunload', (e) => {
            if (hasUnsavedWork()) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    return { init };
})();
