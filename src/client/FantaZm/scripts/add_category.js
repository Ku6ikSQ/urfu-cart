document.addEventListener('DOMContentLoaded', () => {
    const addCategoryButtons = document.querySelectorAll('.add-category');
    function addCategory(button) {
        const categoryName = prompt('Введите название новой категории:');
        if (categoryName && categoryName.trim() !== '') {
            const newCategory = document.createElement('li');
            const categoryLink = document.createElement('a');
            categoryLink.href = '#';
            categoryLink.textContent = categoryName;

            newCategory.appendChild(categoryLink);
            const parentDropdown = button.closest('.dropdown-content');

            if (parentDropdown) {
                parentDropdown.insertBefore(newCategory, button);
                parentDropdown.appendChild(button);
            }
        } else {
            alert('Название категории не может быть пустым!');
        }
    }

    addCategoryButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            addCategory(button);
        });
    });
});
