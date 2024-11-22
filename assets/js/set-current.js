document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-list a");
    const currentPath = window.location.pathname;

    // Remove existing 'current-page' class from all nav items
    navLinks.forEach((link) => {
        link.parentElement.classList.remove("current-page");
    });

    // Add 'current-page' class to the matching nav item
    navLinks.forEach((link) => {
        const linkPath = new URL(link.href).pathname;
        if (
            currentPath === linkPath || // 정확히 일치하는 경우
            (currentPath.startsWith(linkPath) && currentPath[linkPath.length] === "/") // 하위 경로인 경우
        ) {
            link.parentElement.classList.add("current-page");
        }
    });
});
