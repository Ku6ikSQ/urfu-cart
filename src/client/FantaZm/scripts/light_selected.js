document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.left ul li');

    const currentUrl = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

    menuItems.forEach(menuItem => {
        const link = menuItem.querySelector('a');
        if (link && link.getAttribute('href') === currentUrl) {
            menuItem.classList.add('active');
        }
    });
});
