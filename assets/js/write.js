// 글 작성 페이지: 주인 검증 후 작성 영역을 연다.

document.addEventListener('DOMContentLoaded', () => {
    const gate = document.getElementById('auth-gate');
    const editor = document.getElementById('editor-area');
    const form = document.getElementById('auth-form');
    const input = document.getElementById('token-input');
    const message = document.getElementById('auth-message');
    const logout = document.getElementById('logout-button');

    function showMessage(text, isError) {
        message.textContent = text;
        message.classList.toggle('error', isError);
    }

    function setAuthorized(authorized, login) {
        gate.hidden = authorized;
        editor.hidden = !authorized;
        if (authorized) {
            document.getElementById('auth-user').textContent = login;
        }
    }

    async function check(token) {
        showMessage('검증 중...', false);
        const result = await Auth.verify(token);
        if (result.ok) {
            Auth.setToken(token);
            showMessage('', false);
            setAuthorized(true, result.login);
        } else {
            Auth.clear();
            setAuthorized(false);
            showMessage(result.reason, true);
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const token = input.value.trim();
        input.value = '';
        if (token) check(token);
    });

    logout.addEventListener('click', () => {
        Auth.clear();
        setAuthorized(false);
        showMessage('', false);
    });

    // 같은 탭에서 이미 검증한 토큰이 있으면 재검증 후 진입
    const saved = Auth.getToken();
    if (saved) check(saved);
});
