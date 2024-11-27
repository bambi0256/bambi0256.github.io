document.addEventListener("DOMContentLoaded", () => {
    const tocWrapper = document.querySelector(".toc-wrapper");
    const tocArea = document.querySelector(".toc-area");
    const tocItems = document.querySelectorAll(".toc-list li");
    const headers = document.querySelectorAll(".post-content h1, .post-content h2");

    const tocAreaTop = tocArea.offsetTop;
    const tocAreaHeight = tocArea.offsetHeight;
    const tocWrapperHeight = tocWrapper.offsetHeight;

    // 스크롤 시 TOC 위치 업데이트
    function updateTOCPosition() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        let desiredTop = scrollY + (viewportHeight - tocWrapperHeight) / 2;

        if (desiredTop < tocAreaTop) {
            desiredTop = tocAreaTop;
        } else if (desiredTop + tocWrapperHeight > tocAreaTop + tocAreaHeight) {
            desiredTop = tocAreaTop + tocAreaHeight - tocWrapperHeight;
        }

        tocWrapper.style.top = `${desiredTop - tocAreaTop}px`;
    }

    // 가장 가까운 헤더 탐색 및 TOC 강조
    function highlightActiveTOC() {
        let activeIndex = -1;
        const targetPoint = window.scrollY + (window.innerHeight * 0.2);

        headers.forEach((header, index) => {
            const headerPosition = header.offsetTop;
            if (headerPosition <= targetPoint) {
                activeIndex = index;
            }
        });

        tocItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
    }

    // 헤더 클릭 시 스크롤 이동
    tocItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            const targetHeader = headers[index];
            if (targetHeader) {
                const headerOffset = 80;
                const targetPosition = targetHeader.getBoundingClientRect().top + window.scrollY - headerOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 스크롤 이벤트 연결
    window.addEventListener("scroll", () => {
        updateTOCPosition();
        highlightActiveTOC();
    });

    // 초기화
    updateTOCPosition();
    highlightActiveTOC();
});
