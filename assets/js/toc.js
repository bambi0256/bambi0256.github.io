document.addEventListener("DOMContentLoaded", () => {
    const tocWrapper = document.querySelector(".toc-wrapper");
    const tocList = document.querySelector(".toc-list");
    const headings = document.querySelectorAll("h1, h2");
    const contentBounds = document.querySelector(".content-container").getBoundingClientRect();

    // TOC 높이를 리스트 길이에 맞춤
    tocWrapper.style.height = `${tocList.offsetHeight}px`;

    // 스크롤 동작을 통해 TOC 위치 조정
    const adjustTOCPosition = () => {
        const viewportCenter = window.innerHeight / 2;
        const tocHeight = tocList.offsetHeight;
        const contentTop = contentBounds.top + window.scrollY;
        const contentBottom = contentBounds.bottom + window.scrollY - tocHeight;

        if (window.scrollY > contentTop && window.scrollY < contentBottom) {
            tocWrapper.style.position = "fixed";
            tocWrapper.style.top = `${viewportCenter - tocHeight / 2}px`;
        } else if (window.scrollY <= contentTop) {
            tocWrapper.style.position = "absolute";
            tocWrapper.style.top = "0";
        } else if (window.scrollY >= contentBottom) {
            tocWrapper.style.position = "absolute";
            tocWrapper.style.top = `${contentBounds.height - tocHeight}px`;
        }
    };

    // 현재 스크롤 위치에 따라 TOC 활성화 상태 업데이트
    const updateActiveTOCItem = () => {
        let current = "";

        headings.forEach(heading => {
            const headingTop = heading.getBoundingClientRect().top;
            if (headingTop <= window.innerHeight / 2 && headingTop > -window.innerHeight / 2) {
                current = heading.getAttribute("id");
            }
        });

        document.querySelectorAll(".toc-list li").forEach(item => {
            item.classList.remove("active");
            if (item.dataset.target === current) {
                item.classList.add("active");
            }
        });
    };

    // TOC 항목 클릭 시 해당 헤더로 이동
    tocList.querySelectorAll("li").forEach(item => {
        item.addEventListener("click", () => {
            const targetId = item.dataset.target;
            const targetElement = document.getElementById(targetId);

            const offset = window.innerHeight * 0.25; // 상단 25% 위치
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });

    // 스크롤 이벤트에 동작 연결
    window.addEventListener("scroll", () => {
        adjustTOCPosition();
        updateActiveTOCItem();
    });

    // 초기 위치 조정
    adjustTOCPosition();
});
