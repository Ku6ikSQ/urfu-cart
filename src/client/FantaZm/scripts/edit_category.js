document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edit-category');
    const content = document.getElementById('content');


    function toggleEditMode() {
        if (editButton.innerText === 'Редактировать') {
            editButton.innerText = 'Отменить';
            const addCategoryButtons = content.querySelectorAll('.btn');
            const spans = content.querySelectorAll('span');
            addCategoryButtons.forEach(button => {
                button.addEventListener('click', function (event) {
                    event.preventDefault();
                    addCategory(button);
                });
                button.style.display = 'block';
            });
            spans.forEach(span => {
                span.style.display = 'block';
            });   
        } else {
            editButton.innerText = 'Редактировать';
            const addCategoryButtons = content.querySelectorAll('.btn');
            const spans = content.querySelectorAll('span');
            addCategoryButtons.forEach(button => {
                button.style.display = 'none';
            });
            spans.forEach(span => {
                span.style.display = 'none';
            });
        }
    }

    editButton.addEventListener('click', () => {
        toggleEditMode();
    });

    async function addCategory(button) {
        const categoryName = prompt('Введите название новой категории:');
        if (categoryName && categoryName.trim() !== '') {
            console.log(categoryName);
            const parent1 = button.closest('.category');
            const newCategory = document.createElement('div');
            const categoryLink = document.createElement('p');
            categoryLink.textContent = categoryName;
            newCategory.appendChild(categoryLink);
            let parent_id = null;
            if (parent1 === null){
                newCategory.classList.add('category');
                parent_id = null;
                const subcategories = document.querySelector('.categories');
                subcategories.appendChild(newCategory);
                subcategories.appendChild(button);
            } else{
                newCategory.classList.add('underCategory');
                parent_id = parent1.querySelector('p').getAttribute('data-id');
                const subcategories = parent1.querySelector('.underCategories');
                subcategories.appendChild(newCategory);
                subcategories.appendChild(button);
            }

            const response = await fetch(`https://5.35.124.24:5000/api/good-categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'title': categoryName,
                    'description': '',
                    'parentId': parent_id,
                    'photo': ''
                })
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            categoryLink.setAttribute('data-id', data.id);
            categoryLink.addEventListener('click', function(e) {
                categoryClick(e,data);
            });
            alert('Категория успешно добавлена!');
            window.location.reload();
        } else{
            alert('Название категории не может быть пустым!');
        }
    }
});
