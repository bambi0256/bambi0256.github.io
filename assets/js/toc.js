document.addEventListener("DOMContentLoaded", () => {
    const tocLinks = document.querySelectorAll(".toc-container a");

    // Smooth scrolling to sections
    tocLinks.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20, // Adjust for spacing
                    behavior: "smooth"
                });
            }
        });
    });

    // Highlight the current section in the TOC
    const sections = Array.from(document.querySelectorAll("h1, h2"));
    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionId = section.getAttribute("id");
            const link = document.querySelector(`.toc-container a[href="#${sectionId}"]`);

            if (
                section.offsetTop - 100 <= scrollPosition &&
                section.offsetTop + section.offsetHeight > scrollPosition
            ) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    });
});
