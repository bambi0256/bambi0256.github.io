document.addEventListener("DOMContentLoaded", () => {
    const tocItems = document.querySelectorAll(".toc-list li");
    const headings = document.querySelectorAll("h1, h2");
    const tocWrapper = document.querySelector(".toc-wrapper");
    const contentContainer = document.querySelector(".content-container");

    // Get content bounds
    const contentBounds = contentContainer.getBoundingClientRect();

    // Update TOC position on scroll
    window.addEventListener("scroll", () => {
        let current = "";

        headings.forEach(heading => {
            const headingTop = heading.getBoundingClientRect().top;
            if (headingTop <= window.innerHeight / 2 && headingTop > -window.innerHeight / 2) {
                current = heading.getAttribute("id");
            }
        });

        // Activate corresponding TOC item
        tocItems.forEach(item => {
            item.classList.remove("active");
            if (item.dataset.target === current) {
                item.classList.add("active");
            }
        });

        // Ensure TOC stays within content bounds
        const contentTop = contentBounds.top + window.scrollY;
        const contentBottom = contentBounds.bottom + window.scrollY - window.innerHeight;
        const tocTop = Math.max(contentTop, window.scrollY + (window.innerHeight - tocWrapper.offsetHeight) / 2);
        tocWrapper.style.top = `${Math.min(tocTop, contentBottom)}px`;
    });

    // Scroll to heading on TOC item click
    tocItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetId = item.dataset.target;
            const targetElement = document.getElementById(targetId);
            targetElement.scrollIntoView({ behavior: "smooth" });
        });
    });
});
