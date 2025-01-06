document.addEventListener('DOMContentLoaded', async function () {
    const content = document.getElementById('content');
    content.innerHTML = '';
    response = await fetch(`https://5.35.124.24:5000/api/good-categories` , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    const contentItem = document.createElement('div');
    contentItem.classList.add('categories');
    data.forEach(category => {
        if (category.parent_id === null) {
            const categoryItem = document.createElement('div');
            categoryItem.classList.add('category');
            const categoryName = document.createElement('div');
            categoryName.classList.add('category-name');
            const categoryLink = document.createElement('p');
            categoryLink.setAttribute('data-id', category.id);
            categoryLink.innerText = category.title;
            categoryLink.addEventListener('click', function(e) {
                setActiveClass(e.target);
                categoryClick(e,data);
            });
            categoryName.appendChild(categoryLink);
            const span = document.createElement('span');
            span.innerText = "×";
            span.addEventListener('click', function(e) {
                deleteCategory(category.id);
            });
            categoryName.appendChild(span);
            categoryItem.appendChild(categoryName);
            contentItem.appendChild(categoryItem);
        }
    });
    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.innerText = 'Добавить категорию';
    btn.addEventListener('click', function(e) {
        addCategory(e,data);
    });
    contentItem.appendChild(btn);
    content.appendChild(contentItem);
});

async function categoryClick(e, categories) {
    e.preventDefault();
    const clickedCategory = e.target;
    const id = clickedCategory.getAttribute('data-id');
    console.log(id);
    const allUnderCategories = document.querySelectorAll('.underCategories');
    allUnderCategories.forEach(underCategories => {
        underCategories.remove();
    });
    const parentCategory = clickedCategory.closest('.category');
    if (parentCategory.querySelector('.underCategories')) {
        return;
    }
    const underCategories = document.createElement('div');
    underCategories.classList.add('underCategories');
    for (const category of categories.filter(item => item.parent_id == id)) {
        const underCategory = document.createElement('div');
        underCategory.classList.add('underCategory');
        const categoryLink = document.createElement('p');
        categoryLink.setAttribute('data-id', category.id);
        categoryLink.innerText = category.title;
        categoryLink.addEventListener('click', function(e) {
            setActiveClass(e.target);
            categoryClick(e,data);
        });
        underCategory.appendChild(categoryLink);
        const span = document.createElement('span');
        span.innerText = "×";
        span.addEventListener('click', function(e) {
            deleteCategory(category.id);
        });
        underCategory.appendChild(span);
        underCategories.appendChild(underCategory);
    }
    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.innerText = 'Добавить категорию';
    btn.addEventListener('click', function(e) {
        addCategory(e,data);
    });
    underCategories.appendChild(btn);
    parentCategory.appendChild(underCategories);
}

function setActiveClass(clickedCategory) {
    const allLinks = clickedCategory.closest('.categories').querySelectorAll('.category-name');
    allLinks.forEach(link => {
        link.classList.remove('active');
    });
    clickedCategory.closest('.category-name').classList.add('active');
}

async function deleteCategory(categoryId) {
    const response = await fetch(`https://5.35.124.24:5000/api/good-categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    alert('Категория успешно удалена!');
    window.location.reload();
}