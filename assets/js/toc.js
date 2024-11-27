document.addEventListener("DOMContentLoaded", () => {
    const tocWrapper = document.querySelector(".toc-wrapper");
    const tocArea = document.querySelector(".toc-area");
    const tocItems = document.querySelectorAll(".toc-list li");
    const headers = document.querySelectorAll(".post-content h1, .post-content h2"); // 대상 헤더

    // 스크롤 시 TOC 위치 업데이트
    function updateTOCPosition() {
        const tocAreaRect = tocArea.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const tocWrapperHeight = tocWrapper.offsetHeight;

        // 화면 중앙 위치 계산
        let desiredTop = (viewportHeight - tocWrapperHeight) / 2;

        // 영역 제한
        if (desiredTop < tocAreaRect.top) {
            desiredTop = tocAreaRect.top;
        } else if (desiredTop + tocWrapperHeight > tocAreaRect.bottom) {
            desiredTop = tocAreaRect.bottom - tocWrapperHeight;
        }

        // TOC 위치 업데이트
        tocWrapper.style.position = "absolute";
        tocWrapper.style.top = `${desiredTop}px`;
    }

    // 헤더 클릭 시 스크롤 이동
    tocItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            const targetHeader = headers[index];
            if (targetHeader) {
                const headerOffset = 80; // 헤더 높이에 따른 오프셋
                const targetPosition = targetHeader.getBoundingClientRect().top + window.scrollY - headerOffset;

                // 부드럽게 스크롤
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 현재 화면에 보이는 헤더에 따라 TOC 강조
    function highlightActiveTOC() {
        let activeIndex = -1;

        // 현재 화면에서 가장 가까운 헤더 탐색
        headers.forEach((header, index) => {
            const rect = header.getBoundingClientRect();
            if (rect.top <= 100) { // 화면 상단 근처에 있는 헤더를 기준으로
                activeIndex = index;
            }
        });

        // TOC 항목 강조 업데이트
        tocItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
    }

    // 스크롤 이벤트 연결
    window.addEventListener("scroll", () => {
        updateTOCPosition();
        highlightActiveTOC();
    });

    // 초기화
    updateTOCPosition();
    highlightActiveTOC();
});
