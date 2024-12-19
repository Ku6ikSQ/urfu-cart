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
    const contentItem = document.createElement('ul');
    contentItem.classList.add('categories');
    data.forEach(category => {
        if (category.parent_id === null) {
            const categoryItem = document.createElement('li');
            const categoryLink = document.createElement('a');
            categoryLink.classList.add('link');
            categoryLink.setAttribute('data-id', category.id);
            categoryLink.innerText = category.title;
            categoryLink.addEventListener('click', function(e) {
                setActiveClass(e.target);
                categoryClick(e,data);
            });
            categoryItem.appendChild(categoryLink);
            const span = document.createElement('span');
            span.innerText = "×";
            span.addEventListener('click', function(e) {
                deleteCategory(e.target.closest('li').querySelector('a').getAttribute('data-id'));
            });
            categoryItem.appendChild(span);
            contentItem.appendChild(categoryItem);
        }
    });
    const btn = document.createElement('li');
    btn.classList.add('btn');
    const btnLink = document.createElement('a');
    btnLink.innerText = 'Добавить категорию';
    btn.appendChild(btnLink); 
    contentItem.appendChild(btn);
    content.appendChild(contentItem);
});

async function categoryClick(e, categories) {
    e.preventDefault();
    const clickedCategory = e.target;
    const id = clickedCategory.getAttribute('data-id');
    const existingSubDivs = document.querySelectorAll('.contentDiv');
    existingSubDivs.forEach(div => div.remove());
    const subcategories = categories.filter(category => category.parent_id == id);
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('contentDiv');
    contentDiv.setAttribute('data-parent-id', id);
    contentDiv.style.marginLeft = '20px'; 
    contentDiv.style.display = 'flex';
    contentDiv.style.flexDirection = 'row';
    contentDiv.style.gap = '10px'; 
    contentDiv.style.flexWrap = 'wrap'; 
    if (subcategories.length > 0) {
        subcategories.forEach(category => {
            const subContent = document.createElement('ul');
            subContent.classList.add('categories');
            const categoryItem = document.createElement('li');
            const categoryLink = document.createElement('a');
            categoryLink.classList.add('link');
            categoryLink.setAttribute('data-id', category.id);
            categoryLink.innerText = category.title;
            categoryItem.appendChild(categoryLink);
            const span = document.createElement('span');
            span.innerText = "×";
            span.addEventListener('click', function(e) {
                deleteCategory(e.target.closest('li').querySelector('a').getAttribute('data-id'));
            });
            categoryItem.appendChild(span);
            subContent.appendChild(categoryItem);
            const subsubcategories = categories.filter(subcategory => subcategory.parent_id == category.id);
            if (subsubcategories.length > 0) {
                subsubcategories.forEach(subcategory => {
                    const subcategoryItem = document.createElement('li');
                    const subcategoryLink = document.createElement('a');
                    subcategoryLink.classList.add('link');
                    subcategoryLink.setAttribute('data-id', subcategory.id);
                    subcategoryLink.innerText = subcategory.title;
                    subcategoryItem.appendChild(subcategoryLink);
                    const subspan = document.createElement('span');
                    subspan.innerText = "×";
                    subspan.addEventListener('click', function(e) {
                        deleteCategory(e.target.closest('li').querySelector('a').getAttribute('data-id'));
                    });
                    subcategoryItem.appendChild(subspan);
                    subContent.appendChild(subcategoryItem);
                });
                categoryItem.classList.add('active');
            }
            const btn = document.createElement('li');
            btn.classList.add('btn');
            const btnLink = document.createElement('a');
            btnLink.innerText = 'Добавить категорию';
            btn.appendChild(btnLink);
            subContent.appendChild(btn);
            contentDiv.appendChild(subContent);
        });
    }
    const ulbtn = document.createElement('ul');
    ulbtn.classList.add('categories');
    const btn = document.createElement('li');
    btn.classList.add('btn');
    const btnLink = document.createElement('a');
    btnLink.innerText = 'Добавить категорию';
    btn.appendChild(btnLink);
    ulbtn.appendChild(btn);
    contentDiv.appendChild(ulbtn);
    const content = document.getElementById('content');
    content.appendChild(contentDiv);
}   

function setActiveClass(clickedCategory) {
    const allLinks = clickedCategory.closest('.categories').querySelectorAll('li');
    allLinks.forEach(link => {
        link.classList.remove('active');
    });
    clickedCategory.closest('li').classList.add('active');
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