document.addEventListener("DOMContentLoaded", () => {
    const tocItems = document.querySelectorAll(".toc-list li"); // TOC 목록
    const postHeaders = document.querySelectorAll(".post-content h1, .post-content h2"); // 콘텐츠 헤더

    // TOC 항목 클릭 시 해당 섹션으로 스크롤
    tocItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetId = item.getAttribute("data-target"); // TOC 항목의 대상 ID
            const targetElement = document.getElementById(targetId); // 대상 요소 찾기
            if (targetElement) {
                const headerOffset = 80; // 헤더 높이에 따른 오프셋
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                // 부드럽게 스크롤
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 스크롤 시 활성화된 TOC 항목 강조
    const highlightActiveTOC = () => {
        let activeIndex = -1;

        // 현재 화면에서 보이는 헤더 탐지
        postHeaders.forEach((header, index) => {
            const rect = header.getBoundingClientRect();
            if (rect.top <= 100) { // 헤더가 화면 상단 근처에 위치하면
                activeIndex = index;
            }
        });

        // 활성화 상태 업데이트
        tocItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
    };

    window.addEventListener("scroll", highlightActiveTOC); // 스크롤 이벤트 추가
    highlightActiveTOC(); // 페이지 로드 시 초기화
});
