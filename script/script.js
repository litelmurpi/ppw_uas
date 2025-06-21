document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.burger-menu');
    const navbar = document.querySelector('.navbar');

    if (burgerMenu && navbar) {
        burgerMenu.addEventListener('click', () => {
            navbar.classList.toggle('active');
            // Accessibility: Toggle aria-expanded
            const isExpanded = burgerMenu.getAttribute('aria-expanded') === 'true';
            burgerMenu.setAttribute('aria-expanded', !isExpanded);
        });
    }
});