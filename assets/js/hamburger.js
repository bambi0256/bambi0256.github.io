document.addEventListener("DOMContentLoaded", function () {
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    hamburgerMenu.addEventListener("click", () => {
        dropdownMenu.classList.toggle("active");
    });
});
