document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (!hamburger || !navMenu) return;

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Update aria-label for accessibility
        hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Toggle menu');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            body.classList.remove('menu-open');
            hamburger.setAttribute('aria-label', 'Toggle menu');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            body.classList.remove('menu-open');
            hamburger.setAttribute('aria-label', 'Toggle menu');
        }
    });

    // Close menu when window is resized to desktop size
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                body.classList.remove('menu-open');
                hamburger.setAttribute('aria-label', 'Toggle menu');
            }
        }, 250);
    });
});
