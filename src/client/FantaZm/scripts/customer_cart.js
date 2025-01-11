document.addEventListener('DOMContentLoaded', function() {
    const login = document.querySelector('.login');
    const register = document.querySelector('.register');
    const cabinet = document.querySelector('#cabinet');
    const cart = document.getElementById('customerCart');
    const cartButton = document.getElementById('cartButton');
    const userId = sessionStorage.getItem('userId');
    const checkout = document.querySelector('.checkout');
    let cartData = localStorage.getItem('cartData');
    if (!cartData) {
        cartData = { items: [] };
        localStorage.setItem('cartData', JSON.stringify(cartData));
    } else {
        cartData = JSON.parse(cartData);
    }

    checkout.addEventListener('click', async function(event) {
        if (userId) {
            const response = await fetch(`https://5.35.124.24:5000/api/cart/user/${userId}`);
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            const cart = data.filter(item => item.main == true)[0];
            if (cart.items.length == 0) {
                alert('Ваша корзина пуста');
                return;
            }
            window.location.href = 'test_order_confirmation.html';
        } else {
            if (cartData.items.length == 0) {
                alert('Ваша корзина пуста');
                return;
            }
            alert('Для оформления заказа необходимо войти в личный кабинет');
        }
    });

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

    async function createCartCard(item, intSum, cartId) {
        const card = document.createElement('div');
        card.classList.add('cartItem');
        const imgTextContent = document.createElement('div');
        imgTextContent.classList.add('imgTextContent');
        const inputCheck = document.createElement('input');
        inputCheck.type = 'checkbox';
        inputCheck.checked = item.selected;
        inputCheck.addEventListener('change', async function () {
            if (userId) {
                const response = await fetch(`https://5.35.124.24:5000/api/cart/${cartId}/${item.goods_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'count': item.count,
                        'selected': inputCheck.checked
                    })
                });
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
            } else {
                const cartData = JSON.parse(localStorage.getItem('cartData'));
                const cartItemIndex = cartData.items.findIndex(i => i.goods_id == item.goods_id);
                cartData.items[cartItemIndex].count = item.count;
                cartData.items[cartItemIndex].selected = inputCheck.checked;
                localStorage.setItem('cartData', JSON.stringify(cartData));
            }
        });
        inputCheck.classList.add('inputCheck');
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
        price.textContent = `${good.price * item.count} ₽`;
        intSum += Number(good.price * item.count);
        textInfo.appendChild(price);
        imgTextContent.appendChild(inputCheck);
        imgTextContent.appendChild(img);
        imgTextContent.appendChild(textInfo);
        card.appendChild(imgTextContent);
        const itemCount = document.createElement('div');
        itemCount.classList.add('itemCount');
        const decrement = document.createElement('span');
        decrement.classList.add('decrement');
        decrement.innerHTML = '-';
        decrement.addEventListener('click', async function () {
            if (item.count <= 1) {
                if (userId) {
                    const response = await fetch(`https://5.35.124.24:5000/api/cart/${cartId}/${item.goods_id}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        throw new Error(`Ошибка HTTP: ${response.status}`);
                    }
                    const data = await response.json();
                } else {
                    const cartData = JSON.parse(localStorage.getItem('cartData'));
                    const cartItemIndex = cartData.items.findIndex(i => i.goods_id == item.goods_id);
                    cartData.items.splice(cartItemIndex, 1);
                    localStorage.setItem('cartData', JSON.stringify(cartData));
                }
                const metricResponse = await fetch(`https://5.35.124.24:5000/api/metrics/${item.goods_id}`,{
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
                const event = new CustomEvent('cartUpdate',{
                    detail : {
                        'goodsId' : item.goods_id,
                        'action' : 'delete'
                    },
                });
                document.dispatchEvent(event);
                alert('Товар успешно удален из корзины');
                openCart();
                return;
            }
            if (userId) {
                const response = await fetch(`https://5.35.124.24:5000/api/cart/${cartId}/${item.goods_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'count': item.count - 1,
                        'selected': inputCheck.checked
                    })
                });
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                const data = await response.json();
            } else {
                const cartData = JSON.parse(localStorage.getItem('cartData'));
                const cartItemIndex = cartData.items.findIndex(i => i.goods_id == item.goods_id);
                cartData.items[cartItemIndex].count -= 1;
                localStorage.setItem('cartData', JSON.stringify(cartData));
            }
            const event = new CustomEvent('cartUpdate',{
                detail : {
                    'goodsId' : item.goods_id,
                    'action' : 'decrement'
                },
            });
            document.dispatchEvent(event);
            openCart();
        });
        itemCount.appendChild(decrement);
        const count = document.createElement('p');
        count.textContent = item.count;
        itemCount.appendChild(count);
        const increment = document.createElement('span');
        increment.classList.add('increment');
        increment.innerHTML = '+';
        increment.addEventListener('click', async function () {
            if (item.count == good.stock){
                alert('Это максимальное количество товара');
                return;
            }
            if (userId) {
                const response = await fetch(`https://5.35.124.24:5000/api/cart/${cartId}/${item.goods_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'count': item.count + 1,
                        'selected': inputCheck.checked
                    })
                });
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                const data = await response.json();
            } else {
                const cartData = JSON.parse(localStorage.getItem('cartData'));
                const cartItemIndex = cartData.items.findIndex(i => i.goods_id == item.goods_id);
                cartData.items[cartItemIndex].count += 1;
                localStorage.setItem('cartData', JSON.stringify(cartData));
            }
            const event = new CustomEvent('cartUpdate',{
                detail : {
                    'goodsId' : item.goods_id,
                    'action' : 'increment'
                },
            });
            document.dispatchEvent(event);
            openCart();
        });
        itemCount.appendChild(increment);
        card.appendChild(itemCount);
        const cross = document.createElement('span');
        cross.classList.add('close');
        cross.id = 'close';
        cross.innerHTML = '&times;';
        cross.addEventListener('click', async function () {
            if (userId) {
                const response = await fetch(`https://5.35.124.24:5000/api/cart/${cartId}/${item.goods_id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                const data = await response.json();
            } else {
                const cartData = JSON.parse(localStorage.getItem('cartData'));
                const cartItemIndex = cartData.items.findIndex(item => item.goods_id == item.goods_id);
                cartData.items.splice(cartItemIndex, 1);
                localStorage.setItem('cartData', JSON.stringify(cartData));
            }
            const metricResponse = await fetch(`https://5.35.124.24:5000/api/metrics/${item.goods_id}`,{
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
            const event = new CustomEvent('cartUpdate',{
                detail : {
                    'goodsId' : item.goods_id,
                    'action' : 'delete'
                },
            });
            document.dispatchEvent(event);
            alert('Товар успешно удален из корзины');
            openCart();
        });
        card.appendChild(cross);
        return {card, intSumNew: intSum};
    }

    async function openCart(){
        cart.style.display = "block";
        const content = cart.querySelector('.cartContent');
        content.innerHTML = '';
        const totalSum = document.getElementById('totalSum');
        const userId = sessionStorage.getItem('userId') || '';
        if (userId) {
            const response = await fetch(`https://5.35.124.24:5000/api/cart/user/${userId}`);
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            const cart = data.filter(item => item.main == true)[0];
            let intSum = 0;
            for (const item of cart.items) {
                const {card,intSumNew} = await createCartCard(item, intSum, cart.cart_id);
                intSum = intSumNew;
                content.appendChild(card);
            };
            totalSum.textContent = `Сумма заказа: ${intSum} ₽`;
        } else {
            const cartData = JSON.parse(localStorage.getItem('cartData'));
            let intSum = 0;
            for (const item of cartData.items) {
                const {card,intSumNew} = await createCartCard(item, intSum);
                intSum = intSumNew;
                content.appendChild(card);
            };
            totalSum.textContent = `Сумма заказа: ${intSum} ₽`;
        }
    }

    cartButton.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        openCart();
    });

    function closeCart(){
        cart.style.display = "none";
    }

    document.addEventListener('click',(event) => {
        if (cart.style.display === "block" && !cart.querySelector('.cart').contains(event.target) && event.target !== cartButton) {
            closeCart();
        }
    });

     if (sessionStorage.getItem('isAuth')){
         login.style.display = 'none';
         register.style.display = 'none';
         cabinet.style.display = 'block';
     } else {
         login.style.display = 'block';
         register.style.display = 'block';
         cabinet.style.display = 'none';
     }
});