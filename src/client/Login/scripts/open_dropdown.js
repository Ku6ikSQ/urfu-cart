document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');

        toggle.addEventListener('click', function(event) {
            event.preventDefault(); 
            dropdown.classList.toggle('open'); 
        });
    });
});
