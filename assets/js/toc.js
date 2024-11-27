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

        // 화면 중앙 기준 계산
        let desiredTop = scrollY + (viewportHeight - tocWrapperHeight) / 2;

        // 영역 제한
        if (desiredTop < tocAreaTop) {
            desiredTop = tocAreaTop;
        } else if (desiredTop + tocWrapperHeight > tocAreaTop + tocAreaHeight) {
            desiredTop = tocAreaTop + tocAreaHeight - tocWrapperHeight;
        }

        // TOC 위치 업데이트
        tocWrapper.style.top = `${desiredTop - tocAreaTop}px`;
    }

    // 활성화 기준 계산
    function calculateTargetPoint() {
        return window.scrollY + (window.innerHeight * 0.2); // 뷰포트 상단에서 20% 지점
    }

    // 가장 가까운 헤더 탐색 및 TOC 강조
    function highlightActiveTOC() {
        let activeIndex = -1;
        const targetPoint = calculateTargetPoint();

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
                const targetPoint = targetHeader.offsetTop - (window.innerHeight * 0.2);

                // 부드럽게 스크롤
                window.scrollTo({
                    top: targetPoint,
                    behavior: "smooth",
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
