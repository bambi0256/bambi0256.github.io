document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-list a");
    const currentPath = window.location.pathname;

    navLinks.forEach((link) => {
        const linkPath = new URL(link.href).pathname;
        if (currentPath.startsWith(linkPath)) {
            link.parentElement.classList.add("current-page");
        }
    });
});