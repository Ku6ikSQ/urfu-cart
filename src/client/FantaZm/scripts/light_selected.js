document.addEventListener('DOMContentLoaded', function () {
    const menuItems = document.querySelectorAll('.left ul li');
    const currentUrl = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

    menuItems.forEach(menuItem => {
        const link = menuItem.querySelector('a');
        if (link && link.getAttribute('href') === currentUrl) {
            menuItem.classList.add('active');
        }
    });

    const dropdownItems = document.querySelectorAll('.content .categories li');

    dropdownItems.forEach(item => {
        item.addEventListener('click', function (event) {
            event.stopPropagation();
            dropdownItems.forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
});
