document.addEventListener('DOMContentLoaded', async function () {
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

    async function getCart(userId){
        try{
            const response = await fetch(`https://5.35.124.24:5000/api/cart/${userId}`,{
                method : 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function getMetrics(id){
        try{
            const metricResponse = await fetch(`https://5.35.124.24:5000/api/metrics/${id}`,{
                method : 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!metricResponse.ok) {
                throw new Error(`Ошибка HTTP: ${metricResponse.status}`);
            }
            const data = await metricResponse.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
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

    const content = document.getElementById("mainContent");
    content.innerHTML = '';
    const productId = window.location.href.split('?id=')[1];
    const good = await getGood(productId);
    if (good) {
        const metricdata = await getMetrics(productId);
        console.log(metricdata);
        console.log(metricdata.add_to_cart_count);
        const atcc = metricdata.add_to_cart_count || 0;
        const oc = metricdata.order_count || 0;
        const patchmetric = await fetch(`https://5.35.124.24:5000/api/metrics/${productId}`,{
            method:'PATCH',
            headers : {
                'Content-Type':'application/json'
            },
            body : JSON.stringify({
                'views':metricdata.views+1,
                'addToCartCount': atcc,
                'orderCount':oc
            })
        });
        if (!patchmetric.ok) {
            console.log(patchmetric);
        }
        const ret = await patchmetric.json();
        console.log(ret);
        const images = document.createElement('div');
        images.classList.add('images');
        const currentImage = await getFileLink(good.photos[0]);
        images.innerHTML = `
            <img src="${currentImage ? currentImage : 'assets/good_without_pic.jpg'}" alt="Карточка товара" class="good_pic">
            `;
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
        const priceText = document.createElement('p');
        priceText.innerText = `${good.price} ₽`;
        price.appendChild(priceText);
        const buttons = document.createElement('div');
        buttons.classList.add('buttons');
        const userId = sessionStorage.getItem('userId');
        const cartData = await getCart(userId);
        const cartItem = cartData.items.find(item => item.goods_id == good.id);
        if (cartItem) {
            const itemCount = document.createElement('div');
            itemCount.classList.add('itemCount');
            itemCount.classList.add('buy');
            itemCount.style.justifyContent = 'space-around';
            const decrement = document.createElement('span');
            decrement.classList.add('decrement');
            decrement.innerHTML = '-';
            decrement.addEventListener('click', async function () {
                if (cartItem.count <= 1) {
                    const response = await fetch(`https://5.35.124.24:5000/api/cart/${userId}/${cartItem.goods_id}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        throw new Error(`Ошибка HTTP: ${response.status}`);
                    }
                    const data = await response.json();
                    const metricdata = await getMetrics(cartItem.goods_id);
                    const metricResponse = await fetch(`https://5.35.124.24:5000/api/metrics/${cartItem.goods_id}`,{
                        method:'PATCH',
                        headers : {
                            'Content-Type':'application/json'
                        },
                        body : JSON.stringify({
                            'views':metricdata.views,
                            'addToCartCount': metricdata.add_to_cart_count - 1,
                            'orderCount':metricdata.order_count
                        })
                    });
                    if (!metricResponse.ok) {
                        console.log(metricResponse);
                    }
                    const ret = await metricResponse.json();
                    console.log(ret);
                    console.log(data);
                    alert('Товар успешно удален из корзины');
                    window.location.reload();
                    return;
                }
                const response = await fetch(`https://5.35.124.24:5000/api/cart/${userId}/${cartItem.goods_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'count': cartItem.count - 1,
                        'selected': true
                    })
                });
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                const data = await response.json();
                window.location.reload();
            });
            itemCount.appendChild(decrement);
            const count = document.createElement('p');
            count.textContent = cartItem.count;
            itemCount.appendChild(count);
            const increment = document.createElement('span');
            increment.classList.add('increment');
            increment.innerHTML = '+';
            increment.addEventListener('click', async function () {
                if (cartItem.count == good.stock){
                    alert('Это максимальное количество товара');
                    return;
                }
                const response = await fetch(`https://5.35.124.24:5000/api/cart/${userId}/${cartItem.goods_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'count': cartItem.count + 1,
                        'selected': true
                    })
                });
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                const data = await response.json();
                window.location.reload();
            });
            itemCount.appendChild(increment);
            buttons.appendChild(itemCount);
        } else {
            const buyButton = document.createElement('button');
            buyButton.classList.add('buy');
            buyButton.innerText = 'Купить';
            buyButton.addEventListener('click', async function () {
                if (cartItem) {
                    if (cartItem.count == good.stock) {
                        alert('Это максимальное количество товара');
                        return;
                    }
                }
                const response = await fetch(`https://5.35.124.24:5000/api/cart/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'goodsId': good.id,
                        'count': 1,
                        'selected': true
                    })
                });
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                const data = await response.json();
                const metricdata = await getMetrics(good.id);
                let count = metricdata.add_to_cart_count;
                if (!cartItem){
                    count = count + 1;
                }
                const patchmetric = await fetch(`https://5.35.124.24:5000/api/metrics/${good.id}`,{
                    method:'PATCH',
                    headers : {
                        'Content-Type':'application/json'
                    },
                    body : JSON.stringify({
                        'views':metricdata.views,
                        'addToCartCount': count,
                        'orderCount':metricdata.order_count
                    })
                    });
                if (!patchmetric.ok) {
                    console.log(patchmetric);
                }
                const ret = patchmetric.json();
                console.log(ret);
                console.log(data);
                alert('Товар успешно добавлен в корзину');
                window.location.reload();
            });
            buttons.appendChild(buyButton);
        }
        const star = document.createElement('img');
        star.id = 'star';
        star.src = 'assets/star.png';
        star.addEventListener('click', function () {
            if (star.src.includes('star.png')) {
                star.src = 'assets/star_filled.png';
            } else {
                star.src = 'assets/star.png';
            }
        });
        buttons.appendChild(star);
        info.appendChild(price);
        info.appendChild(buttons);
        const description = document.createElement('p');
        description.classList.add('description');
        description.innerText = good.description;
        info.appendChild(description);
        content.appendChild(info);
    } else {
        content.innerHTML = 'Товар не найден';
    }
});