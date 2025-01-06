document.addEventListener('DOMContentLoaded', async function () {
    const userId = sessionStorage.getItem('userId') || '';
    let cartData = userId ? await getCart(userId) : JSON.parse(localStorage.getItem('cartData')) || { items: [] };
    let favoritesData = userId ? await getFavorites(userId) : JSON.parse(localStorage.getItem('favoritesData')) || { items: [] };

    async function deleteFromCart(userId, goodId) {
        try {
            const cartId = cartData.cart_id;
            const response = await fetch(`https://5.35.124.24:5000/api/cart/${cartId}/${goodId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function createStar(good){
        if (userId) {
            favoritesData = await getFavorites(userId);
        } else {
            favoritesData = JSON.parse(localStorage.getItem('favoritesData'));
        }
        const star = document.createElement('img');
        const isFavorite = favoritesData.items.some(item => item.goods_id == good.id);
        star.src = isFavorite ? 'assets/star_filled.png' : 'assets/star.png';
        star.classList.add('star');
        star.addEventListener('click', async () =>{ 
            await handleStarClick(good, star);
            const isFavorite = favoritesData.items.some(item => item.goods_id == good.id);
            star.src = isFavorite ? 'assets/star_filled.png' : 'assets/star.png';
        });
        return star;
    }

    async function updateCartCount(goodId, count) {
        try {
            const cartId = cartData.cart_id;
            const response = await fetch(`https://5.35.124.24:5000/api/cart/${cartId}/${goodId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'count': count,
                    'selected': true
                })
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function getFileLink(fileName) {
        if (fileName) {
            try {
                const response = await fetch(`https://5.35.124.24:5000/api/file/${fileName}`);
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                return response.json();
            } catch (error) {
                console.error('Ошибка при получении ссылки на файл:', error);
                return null;
            }
        } else {
            return null;
        }
    }

    async function getGood(id) {
        try {
            const response = await fetch(`https://5.35.124.24:5000/api/goods/${id}`);
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function getFavorites(userId) {
        try {
            const response = await fetch(`https://5.35.124.24:5000/api/favorites/${userId}`,{
                method : 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function getCart(userId) {
        try {
            const response = await fetch(`https://5.35.124.24:5000/api/cart/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            const cart = data.filter(item => item.main == true);
            console.log(cart);
            return cart[0];
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function handleBuyButtonClick(good, buyButton,buttons){
        if (userId) {
            favoritesData = await getFavorites(userId);
        } else {
            cartData = JSON.parse(localStorage.getItem('cartData'));
            favoritesData = JSON.parse(localStorage.getItem('favoritesData'));
        }
        let newItem;
        if (userId) {
            newItem = {
                'goodsId': good.id,
                'count': 1,
                'selected': true
            };
        } else {
            newItem = {
                'goods_id': good.id,
                'count': 1,
                'selected': true
            };
        }
        if (userId) {
            const cartId = cartData.cart_id;
            const response = await fetch(`https://5.35.124.24:5000/api/cart/${cartId}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            if (!response.ok) {
                alert('Ошибка добавления товара в корзину.');
                return;
            }
        } else {
            if (!cartData) {
                cartData = { items: [] };
            }
            const existingCartItem = cartData.items.find(item => item.goods_id == good.id);
            if (!existingCartItem) {
                cartData.items.push(newItem);
                localStorage.setItem('cartData', JSON.stringify(cartData));
            }
        }
        const metricResponse = await fetch(`https://5.35.124.24:5000/api/metrics/${good.id}`,{
            method:'PATCH',
            headers : {
                'Content-Type':'application/json'
            },
            body : JSON.stringify({
                'views':0,
                'addToCartCount': 1,
                'orderCount':0,
                'addToFavoritesCount':0
            })
        });
        if (!metricResponse.ok) {
            console.log(metricResponse);
        }
        const ret = await metricResponse.json();
        buttons.innerHTML = '';
        await createItemCounter(good, 1, buttons);
        const star = await createStar(good);
        buttons.appendChild(star);
    }

    async function handleStarClick(good, star){
        if (star.src.includes('star_filled.png')) {
            if (userId) {
                const response = await fetch(`https://5.35.124.24:5000/api/favorites/${userId}/${good.id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
            } else {
                const index = favoritesData.items.findIndex(item => item.goods_id == good.id);
                if (index > -1) {
                    favoritesData.items.splice(index, 1);
                    localStorage.setItem('favoritesData', JSON.stringify(favoritesData));
                }
            }
            const metricResponse = await fetch(`https://5.35.124.24:5000/api/metrics/${good.id}`,{
                method:'PATCH',
                headers : {
                    'Content-Type':'application/json'
                },
                body : JSON.stringify({
                    'views': 0,
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
        } else {
            if (userId) {
                const response = await fetch(`https://5.35.124.24:5000/api/favorites/${userId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'goodsId': good.id })
                });
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
            } else {
                if (!favoritesData.items.find(item => item.goods_id == good.id)) {
                    favoritesData.items.push({ 'goods_id': good.id });
                    localStorage.setItem('favoritesData', JSON.stringify(favoritesData));
                }
            }
            const metricResponse = await fetch(`https://5.35.124.24:5000/api/metrics/${good.id}`,{
                method:'PATCH',
                headers : {
                    'Content-Type':'application/json'
                },
                body : JSON.stringify({
                    'views': 0,
                    'addToCartCount': 0,
                    'orderCount':0,
                    'addToFavoritesCount': 1
                })
            });
            if (!metricResponse.ok) {
                console.log(metricResponse);
            }
            const ret = await metricResponse.json();
            console.log(ret);
        }
        if (userId) {
            favoritesData = await getFavorites(userId);
        }
    }

    async function createItemCounter(good, initialCount, buttons) {
        const itemCount = document.createElement('div');
        itemCount.classList.add('itemCount', 'buy');
        itemCount.style.justifyContent = 'space-around';

        const decrement = document.createElement('span');
        decrement.classList.add('decrement');
        decrement.innerHTML = '-';

        const count = document.createElement('p');
        count.textContent = initialCount;

        const increment = document.createElement('span');
        increment.classList.add('increment');
        increment.innerHTML = '+';

        decrement.addEventListener('click', async function () {
            const currentCount = parseInt(count.textContent, 10);
            if (currentCount > 1) {
                count.textContent = currentCount - 1;
                if (userId) {
                    await updateCartCount(good.id, currentCount - 1);
                } else {
                    cartItem = cartData.items.find(item => item.goods_id == good.id);
                    cartItem.count--;
                    localStorage.setItem('cartData', JSON.stringify(cartData));
                }
            } else {
                if (confirm('Удалить товар из корзины?')) {
                    if (userId) {
                        await deleteFromCart(userId, good.id);
                    } else {
                        cartData.items = cartData.items.filter(item => item.goods_id !== good.id);
                        localStorage.setItem('cartData', JSON.stringify(cartData));
                    }
                    const metricResponse = await fetch(`https://5.35.124.24:5000/api/metrics/${good.id}`,{
                        method:'PATCH',
                        headers : {
                            'Content-Type':'application/json'
                        },
                        body : JSON.stringify({
                            'views':0,
                            'addToCartCount': -1,
                            'orderCount':0,
                            'addToFavoritesCount':0
                        })
                    });
                    if (!metricResponse.ok) {
                        console.log(metricResponse);
                    }
                    const ret = await metricResponse.json();
                    console.log(ret);
                    itemCount.remove();
                    buttons.innerHTML = '';
                    const buyButton = document.createElement('button');
                    buyButton.classList.add('buy');
                    buyButton.innerText = 'Купить';
                    buyButton.addEventListener('click', async () => await handleBuyButtonClick(good, buyButton,buttons));
                    buttons.appendChild(buyButton);
                    const star = await createStar(good);
                    buttons.appendChild(star);
                    console.log('decrement');
                }
            }
        });

        increment.addEventListener('click', async function () {
            const currentCount = parseInt(count.textContent, 10);
            if (currentCount < good.stock) {
                count.textContent = currentCount + 1;
                if (userId) {
                    await updateCartCount(good.id, currentCount + 1);
                } else {
                    cartItem = cartData.items.find(item => item.goods_id == good.id);
                    cartItem.count++;
                    localStorage.setItem('cartData', JSON.stringify(cartData));
                }
            } else {
                alert('Достигнуто максимальное количество товара.');
            }
        });

        itemCount.appendChild(decrement);
        itemCount.appendChild(count);
        itemCount.appendChild(increment);
        buttons.appendChild(itemCount);
    }

    async function createUI(){
        const content = document.getElementById("mainContent");
        content.innerHTML = '';
        const productId = window.location.href.split('?id=')[1];
        const good = await getGood(productId);
        if (!good) {
            content.innerHTML = 'Товар не найден';
            return;
        }
        const images = document.createElement('div');
        images.classList.add('images');
        images.innerHTML = `<img src="${await getFileLink(good.photos[0]) ? await getFileLink(good.photos[0]) : 'assets/good_without_pic.jpg'}" alt="Карточка товара" class="good_pic">`;
        content.appendChild(images);

        const info = document.createElement('div');
        info.classList.add('info');

        const title = document.createElement('h4');
        title.innerText = good.name;
        info.appendChild(title);

        const article = document.createElement('p');
        article.classList.add('article');
        article.innerText = `Артикул: ${good.article}`;
        info.appendChild(article);

        const price = document.createElement('div');
        price.classList.add('price');
        price.innerHTML = `<p>${good.price} ₽</p>`;
        info.appendChild(price);

        const buttons = document.createElement('div');
        buttons.classList.add('buttons');
        console.log(cartData);
        console.log(cartData.items);
        let cartItem = cartData.items ? cartData.items.find(item => item.goods_id == good.id) : false;
        if (cartItem) {
            await createItemCounter(good, cartItem.count, buttons);
        } else {
            const buyButton = document.createElement('button');
            buyButton.classList.add('buy');
            buyButton.innerText = 'Купить';
            buyButton.addEventListener('click', async () => await handleBuyButtonClick(good, buyButton,buttons));
            buttons.appendChild(buyButton);
        }
        const star = await createStar(good);
        buttons.appendChild(star);
        info.appendChild(buttons);
        const description = document.createElement('p');
        description.classList.add('description');
        description.innerText = good.description;
        info.appendChild(description);
        content.appendChild(info);
        const metricResponse = await fetch(`https://5.35.124.24:5000/api/metrics/${good.id}`,{
            method:'PATCH',
            headers : {
                'Content-Type':'application/json'
            },
            body : JSON.stringify({
                'views': 1,
                'addToCartCount': 0,
                'orderCount':0,
                'addToFavoritesCount':0
            })
        });
        if (!metricResponse.ok) {
            console.log(metricResponse);
        }
        const ret = await metricResponse.json();
        console.log(ret);
    }

    await createUI();

    document.addEventListener('cartUpdate', async (event) => {
        const buttons = document.querySelector('.buttons');
        const productId = window.location.href.split('?id=')[1];
        const good = await getGood(productId);
        const { goodsId, action } = event.detail;
        if (productId != goodsId) return;
        if (action == 'delete') {
            buttons.querySelector('.itemCount').remove();
            const buyButton = document.createElement('button');
            buyButton.classList.add('buy');
            buyButton.innerText = 'Купить';
            buyButton.addEventListener('click', async () => await handleBuyButtonClick(good, buyButton,buttons));
            buttons.insertBefore(buyButton, buttons.firstChild);
        } else if (action == 'increment') {
            const currentCount = parseInt(buttons.querySelector('.itemCount').querySelector('p').textContent, 10);
            buttons.querySelector('.itemCount').querySelector('p').textContent = currentCount + 1;
        } else if (action == 'decrement') {
            const currentCount = parseInt(buttons.querySelector('.itemCount').querySelector('p').textContent, 10);
            buttons.querySelector('.itemCount').querySelector('p').textContent = currentCount - 1;
        }
    });

    document.addEventListener('favoritesUpdate', async (event) => {
        const buttons = document.querySelector('.buttons');
        const productId = window.location.href.split('?id=')[1];
        const good = await getGood(productId);
        const { goodsId, action } = event.detail;
        if (productId != goodsId) return;
        if (action == 'delete') {
            buttons.querySelector('.star').src = 'assets/star.png';
            console.log('favoritesUpdate');
        }
    });
});

