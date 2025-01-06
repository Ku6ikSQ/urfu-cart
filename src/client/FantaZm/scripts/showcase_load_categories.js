document.addEventListener('DOMContentLoaded', async function () {
    const categories = document.getElementById('category-list');
    categories.innerHTML = '';
    const response = await fetch(`https://5.35.124.24:5000/api/good-categories`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
            }
        });
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const allCategoriesItem = document.createElement('li');
    const allCategoriesLink = document.createElement('a');
    allCategoriesLink.classList.add('dropdown-toggle', 'link', 'category_text');
    allCategoriesLink.textContent = 'Все категории';
    allCategoriesLink.setAttribute('data-id', null);
    allCategoriesItem.appendChild(allCategoriesLink);
    categories.appendChild(allCategoriesItem);
    const data = await response.json();
    const categoryList = [];
    data.forEach(category => {
        const li = document.createElement('li');
        li.classList.add('dropdown');
        const a = document.createElement('a');
        a.classList.add('dropdown-toggle');
        a.classList.add('link');
        a.classList.add('category_text');
        a.textContent = category.title;
        a.setAttribute('data-id', category.id);
        li.appendChild(a);
        categories.appendChild(li);
    });
    setupDropdowns();
});

async function loadGoodsForCategory(category_id = null) {
    console.log(category_id);
    const container = document.getElementById('goodsTable');
    container.innerHTML = '';
    const url = category_id!=="null" ? `https://5.35.124.24:5000/api/goods?categoryId=${category_id}` : `https://5.35.124.24:5000/api/goods`;
    console.log(url);
    try{
        const response = await fetch(url,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        if (!response.ok){
            throw new Error(`Ошибка: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        for (const good of data) {
            if (good.stock > 0) {
                const card = await createShowcaseGoodCard(good);
                container.appendChild(card);
            }
        }

        container.querySelectorAll('.good_card').forEach(item => {
            item.addEventListener('click', event => {
                const card = event.target.closest('.good_card');
                const productId = card.dataset.id;
                openGoodCard(productId);
            });
        })

    } catch (error) {
        console.error(error);
    }
}


function setupDropdowns() {
    const dropdownToggle = document.querySelector('.dropdown-toggle.link.category_text');
    const dropdownItems = document.querySelectorAll('#category-list li a');
    const dropdownMenu = document.getElementById('category-list');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault(); 
            dropdownItems.forEach(el => el.classList.remove('active'));
            this.classList.add('active');
            dropdownToggle.textContent = this.textContent;
            dropdownMenu.closest('.dropdown').classList.remove('active');
            const category_id = this.dataset.id;
            loadGoodsForCategory(category_id);
            console.log(`Вы выбрали категорию: ${this.dataset.id}`);
        });
    });
}

document.addEventListener('click', function (event) {
    const dropdown = document.querySelector('.dropdown');
    if (!event.target.closest('.dropdown')) {
        dropdown.classList.remove('active');
    }
});

async function createShowcaseGoodCard(good) {
    const card = document.createElement('div');
    const imageUrl = good.photos[0] ? await getFileLink(good.photos[0]) : 'assets/good_without_pic.jpg';
    card.className = 'good_card';
    card.setAttribute('data-id', good.id.toString());

    card.innerHTML = `
        <img src="${imageUrl}" class="good_pic" >
        <p>${good.name}</p>
        <div class="good_price">
            <p>${good.price}</p><p>₽</p>
        </div>
    `;
    return card;
}

async function getFileLink(fileName) {
    if (fileName) {
        try{
            const response = await fetch(`https://5.35.124.24:5000/api/file/${fileName}`);
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return response.json();
        } 
        catch (error) {
            console.error('Ошибка при получении ссылки на файл:', error);
            return null;
        }
    } else{
        return null;
    }
}

async function openGoodCard(productId) {
    window.location.href = `test_good_card.html?id=${productId}`;
}