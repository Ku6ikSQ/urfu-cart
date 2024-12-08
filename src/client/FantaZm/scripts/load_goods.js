document.addEventListener('DOMContentLoaded', function() {
    const modals = document.getElementById("editModal");
    const closeBtn = document.getElementsByClassName("close")[0];
    const saveButton = document.getElementById("saveButton");
    const fileInput = document.getElementById('fileInput');
    const previewImage = document.querySelector('#editModal .good_pic');
    let currentCard = null;
    let firstImage = null;

    function openModal(productId, card) {
        currentCard = card;
        firstImage = null;

        fetch(`https://5.35.124.24:5000/api/goods/${productId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(async product => {

                document.getElementById("productName").value = product.name || '';
                document.getElementById("productPrice").value = Number(product.price) || 0;
                document.getElementById("productDescription").value = product.description || '';
                document.querySelector('.modal .good_pic').src = await getFileLink(product.photos[0]) || 'assets/good_without_pic.jpg';
                firstImage = product.photos[0];

                modals.style.display = "block";
            })
            .catch(error => {
                console.error('Ошибка при получении данных товара:', error);
                alert('Не удалось загрузить данные товара');
            });
    };

    closeBtn.onclick = function () {
        modals.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == modals) {
            modals.style.display = "none";
        }
    };

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    saveButton.onclick = function () {
        const productId = currentCard.dataset.id;
        const name = document.getElementById('productName').value;
        const brand = document.getElementById('productBrand').value;
        const price = document.getElementById('productPrice').value;
        const description = document.getElementById('productDescription').value;
        const quantity = document.getElementById('goodsRemains').value;

        if (name && price) {
            const updatedData = {
                'name': name,
                'brand': brand,
                'price': parseFloat(price),
                'description':description
            };

            fetch(`https://5.35.124.24:5000/api/goods/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Ошибка HTTP: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    alert('Товар успешно обновлен');
                    currentCard.querySelector('p').innerText = name;
                    currentCard.querySelector('.good_price p').innerText = price + '₽';
                    currentCard.querySelector('.good_pic').src = previewImage.src;
                    modals.style.display = "none";
                })
                .catch(error => {
                    console.error('Ошибка при обновлении товара:', error);
                    alert('Не удалось обновить товар');
                });
        } else {
            alert('Заполните как минимум поля «Наименование товара» и «Цена»');
        }
    };
load_goods();
async function load_goods() {
    const container = document.getElementById('productContainer');
    try{
        const response = await fetch('https://5.35.124.24:5000/api/goods');
        if (!response.ok){
            throw new Error(`Ошибка: ${response.status}`);
        }
        const data = await response.json();
        container.innerHTML = '';
        for (const good of data) {
            const card = await createGoodCard(good);
            container.appendChild(card);
        }

        document.querySelectorAll('.pencil').forEach(item => {
            item.addEventListener('click', event => {
                const card = event.target.closest('.good_card');
                const productId = card.dataset.id;
                openModal(productId, card);
            });
        });
    } catch (error) {
        console.error(error);
    }
};

async function createGoodCard(good) {
    const card = document.createElement('div');
    const imageUrl = good.photos[0] ? await getFileLink(good.photos[0]) : 'assets/good_without_pic.jpg';
    card.className = 'good_card';
    card.setAttribute('data-id', good.id.toString());

    card.innerHTML = `
        <img src="${imageUrl}" class="good_pic" >
        <img class="pencil" src="assets/pencil.png" id="edit_pencil">
        <p>${good.name}</p>
        <div class="good_price">
            <p>${good.price}</p><p>₽</p>
        </div>
    `;
    return card;
}});

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