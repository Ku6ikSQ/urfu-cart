document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.querySelector('.dropdown');

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.dropdown')) {
            dropdown.classList.remove('active');
        }
    });

    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
    dropdownToggle.addEventListener('click', function (event) {
        event.preventDefault();
        dropdown.classList.toggle('active');
    });
});
