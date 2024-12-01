document.addEventListener('DOMContentLoaded', function () {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownItems = document.querySelectorAll('.filter .dropdown-content li');

    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            link.addEventListener('click', function (event) {
                dropdownItems.forEach(el => {
                    const elLink = el.querySelector('a');
                    if (elLink) elLink.classList.remove('active');
                });
                this.classList.add('active');

                dropdownToggle.textContent = this.textContent;
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownItems = document.querySelectorAll('.category_container .dropdown-content li');

    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            link.addEventListener('click', function (event) {
                dropdownItems.forEach(el => {
                    const elLink = el.querySelector('a');
                    if (elLink) elLink.classList.remove('active');
                });
                this.classList.add('active');

                dropdownToggle.textContent = this.textContent;
            });
        }
    });
});
