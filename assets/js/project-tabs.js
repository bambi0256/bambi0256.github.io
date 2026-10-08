// Projects 페이지: 프로젝트 탭 전환과 탭 우측 Learn More 링크 갱신

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-tabs]').forEach(initTabs);
});

function initTabs(root) {
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    const learnMore = root.querySelector('#tab-more');

    function select(index, { focus = false, updateHash = true } = {}) {
        tabs.forEach((tab, i) => {
            const active = i === index;
            tab.setAttribute('aria-selected', String(active));
            tab.tabIndex = active ? 0 : -1;
            panels[i].hidden = !active;
        });
        if (learnMore) learnMore.href = tabs[index].dataset.href;
        if (focus) tabs[index].focus();
        if (updateHash) history.replaceState(null, '', `#${tabs[index].dataset.slug}`);
    }

    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => select(i));
        tab.addEventListener('keydown', (e) => {
            const last = tabs.length - 1;
            const moves = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i + last) % tabs.length, Home: 0, End: last };
            if (e.key in moves) {
                e.preventDefault();
                select(moves[e.key], { focus: true });
            }
        });
    });

    // 주소의 #slug 로 탭 지정, 없으면 첫 번째(최근 포스트가 있는 프로젝트)
    const hashIndex = tabs.findIndex(tab => `#${tab.dataset.slug}` === decodeURIComponent(location.hash));
    select(hashIndex >= 0 ? hashIndex : 0, { updateHash: hashIndex >= 0 });
}
