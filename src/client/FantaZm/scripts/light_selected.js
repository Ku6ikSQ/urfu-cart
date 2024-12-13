document.addEventListener('DOMContentLoaded', function () {
    const menuItems = document.querySelectorAll('.left ul li');
    const currentUrl = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

    menuItems.forEach(menuItem => {
        const link = menuItem.querySelector('a');
        if (link && link.getAttribute('href') === currentUrl) {
            menuItem.classList.add('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const dropdownItems = document.querySelectorAll('.filter .dropdown-content li');

    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            link.addEventListener('click', function (event) {
                event.stopPropagation();
                dropdownItems.forEach(el => {
                    const elLink = el.querySelector('a');
                    if (elLink) elLink.classList.remove('active');
                });
                this.classList.add('active');
            });
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const dropdownItems = document.querySelectorAll('.category_container .dropdown-content li');    

    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            link.addEventListener('click', function (event) {
                event.stopPropagation();
                dropdownItems.forEach(el => {
                    const elLink = el.querySelector('a');
                    if (elLink) elLink.classList.remove('active');
                });
                this.classList.add('active');
            });
        }
    });
});
