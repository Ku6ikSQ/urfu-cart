document.addEventListener('DOMContentLoaded', async function () {
    let favoritesData = localStorage.getItem('favoritesData');
    if (!favoritesData) {
        favoritesData = { items: [] };
        localStorage.setItem('favoritesData', JSON.stringify(favoritesData));
    } else {
        favoritesData = JSON.parse(favoritesData);
    }
    const favorites = document.getElementById('favoritesCart');
    const favoritesButton = document.getElementById('favoritesButton');
    const userId = sessionStorage.getItem('userId');
    
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

    async function getGood(id) {
        try{
            const response = await fetch(`https://5.35.124.24:5000/api/goods/${id}`);
            if (!response.ok){
                throw new Error(`Ошибка: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function createFavoritesCard(item) {
        const card = document.createElement('div');
        card.classList.add('cartItem');
        const imgTextContent = document.createElement('div');
        imgTextContent.classList.add('imgTextContent');
        const good = await getGood(item.goods_id);
        const img = document.createElement('img');
        const curImg = await getFileLink(good.photos[0]);
        img.src = curImg ? curImg : 'assets/good_without_pic.jpg';
        const textInfo = document.createElement('div');
        textInfo.classList.add('textInfo');
        const name = document.createElement('p');
        name.textContent = good.name;
        textInfo.appendChild(name);
        const price = document.createElement('p');
        price.textContent = `${good.price} ₽`;
        textInfo.appendChild(price);
        imgTextContent.appendChild(img);
        imgTextContent.appendChild(textInfo);
        card.appendChild(imgTextContent);
        const cross = document.createElement('span');
        cross.classList.add('close');
        cross.id = 'close';
        cross.innerHTML = '&times;';
        cross.addEventListener('click', async function () {
            if (userId) {
                const response = await fetch(`https://5.35.124.24:5000/api/favorites/${userId}/${item.goods_id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                const data = await response.json();
            } else {
                const favoritesData = JSON.parse(localStorage.getItem('favoritesData'));
                const favoritesItemIndex = favoritesData.items.findIndex(item => item.goods_id == item.goods_id);
                favoritesData.items.splice(favoritesItemIndex, 1);
                localStorage.setItem('favoritesData', JSON.stringify(favoritesData));
            }
            const metricResponse = await fetch(`https://5.35.124.24:5000/api/metrics/${item.goods_id}`,{
                method:'PATCH',
                headers : {
                    'Content-Type':'application/json'
                },
                body : JSON.stringify({
                    'views':0,
                    'addToCartCount': 0,
                    'orderCount':0,
                    'addToFavoritesCount': -1
                })
            });
            if (!metricResponse.ok) {
                console.log(metricResponse);
            }
            const ret = await metricResponse.json();
            console.log(ret);
            const event = new CustomEvent('favoritesUpdate',{
                detail : {
                    'goodsId' : item.goods_id,
                    'action' : 'delete'
                },
            });
            document.dispatchEvent(event);
            alert('Товар успешно удален из избранного');
            openFavorites();
        });
        card.appendChild(cross);
        return {card};
    }

    async function openFavorites(){
        favorites.style.display = "block";
        const content = favorites.querySelector('.cartContent');
        content.innerHTML = '';
        if (userId) {
            const response = await fetch(`https://5.35.124.24:5000/api/favorites/${userId}`);
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            for (const item of data.items) {
                const {card} = await createFavoritesCard(item);
                content.appendChild(card);
            };
        } else {
            const favoritesData = JSON.parse(localStorage.getItem('favoritesData'));
            for (const item of favoritesData.items) {
                const {card} = await createFavoritesCard(item);
                content.appendChild(card);
            };
        }
    }

    favoritesButton.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        openFavorites();
    });

    function closeFavorites(){
        favorites.style.display = "none";
    }

    document.addEventListener('click',(event) => {
        if (favorites.style.display === "block" && !favorites.querySelector('.cart').contains(event.target) && event.target !== favoritesButton) {
            closeFavorites();
        }
    });
});