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
                button.style.display = 'flex';
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
            const newCategory = document.createElement('li');
            const categoryLink = document.createElement('a');
            categoryLink.href = '#';
            categoryLink.textContent = categoryName;
            categoryLink.classList.add('link');
            newCategory.appendChild(categoryLink);
            const parent1 = button.closest('.contentDiv');
            const parent2 = button.closest('.categories');
            const parentLink = parent2.querySelector('li > a');
            let parent_id = null;
            if (parent1 === null){
                parent_id = null;
            } else{
               parent_id = parentLink.getAttribute('data-id') ? parentLink.getAttribute('data-id') : document.querySelectorAll('.active')[1].querySelector('a').getAttribute('data-id');
            }
            const subcategories = parent2;
            subcategories.appendChild(newCategory);
            subcategories.appendChild(button);

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
