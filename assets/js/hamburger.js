document.addEventListener("DOMContentLoaded", function () {
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const overlayMenu = document.querySelector(".overlay-menu");
    const overlayClose = document.querySelector(".overlay-close");

    // Open Overlay Menu
    hamburgerMenu.addEventListener("click", () => {
        overlayMenu.classList.add("active");
        document.body.style.overflow = "hidden"; // Lock scrolling
    });

    // Close Overlay Menu
    overlayClose.addEventListener("click", () => {
        overlayMenu.classList.remove("active");
        document.body.style.overflow = ""; // Unlock scrolling
    });
});
