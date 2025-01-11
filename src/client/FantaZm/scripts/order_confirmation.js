document.addEventListener('DOMContentLoaded', async function () {
    const userId = sessionStorage.getItem('userId') || '';
    const userName = document.getElementById('name');
    const userEmail = document.getElementById('email');
    const userPhone = document.getElementById('phone');
    const userCity = document.getElementById('city');
    const deliveryTypeDiv = document.querySelector('.deliveryType');
    const userDeliveryType = deliveryTypeDiv.querySelector('input[type="radio"]:checked');
    const userAddress = document.getElementById('address');
    const userBuyer = document.getElementById('buyer');
    const userTerms = document.getElementById('termsInput');
    const paymentInfo = document.querySelector('.paymentInfo');
    const userPayment = paymentInfo.querySelector('input[type="radio"]:checked');
    const confirmButton = document.querySelector('.confirmButton');

    async function getRecipientById(recipientId) {
        try{
            const response = await fetch(`https://5.35.124.24:5000/api/recipients/${recipientId}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function getDelivery(deliveryId) {
        try{
            const response = await fetch(`https://5.35.124.24:5000/api/deliveries/${deliveryId}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function getPayment(paymentId) {
        try{
            const response = await fetch(`https://5.35.124.24:5000/api/payments/${paymentId}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    const orderData = sessionStorage.getItem('orderData');
    if (orderData) {
        const orderDataJson = JSON.parse(orderData);
        const recipientId = orderDataJson.recipientId;
        const deliveryId = orderDataJson.deliveryId;
        const paymentId = orderDataJson.paymentId;
        const recipient = await getRecipientById(recipientId);
        const delivery = await getDelivery(deliveryId);
        const payment = await getPayment(paymentId);
        userBuyer.value = recipient.first_name + ' ' + recipient.middle_name + ' ' + recipient.last_name;
        userPhone.value = recipient.phone;
        userCity.value = recipient.zip_code;
        userAddress.value = recipient.address;
        document.getElementById(delivery.title).checked = true;
        document.getElementById(payment.title).checked = true;
    }

    confirmButton.addEventListener('click', async function () {
        const name = userName.value || '';
        const email = userEmail.value || '';
        const phone = userPhone.value || '';
        if (phone.length != 12) {
            alert('Номер телефона должен состоять из 12 цифр');
            return;
        }
        const city = userCity.value || '';
        const deliveryType = deliveryTypeDiv.querySelector('input[type="radio"]:checked')?.id || null;
        const address = userAddress.value || '';
        const buyer = userBuyer.value || '';
        const terms = userTerms.checked || false;
        const payment = paymentInfo.querySelector('input[type="radio"]:checked')?.id || null;
        if (name && email && phone && city && deliveryType && address && buyer && terms && payment) {
            const cart = await getCart(userId);
            const goods = cart.items.filter(item => item.selected);
            if (goods.length == 0){
                alert('Выберите хотя бы один товар');
                return;
            }
            let recipient;
            const fullName = buyer.split(' ');
            const firstName = fullName[0];
            const middleName = fullName[1] ? fullName[1] : '';
            const lastName = fullName[2] ? fullName[2] : '';
            const newRecipient = await fetch(`https://5.35.124.24:5000/api/recipients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    'userId': userId,
                    'firstName': firstName,
                    'lastName': lastName,
                    'middleName': middleName,
                    'address': address,
                    'zipCode': city,
                    'phone': phone
                 })
            });
            if (!newRecipient.ok) {
                throw new Error(`Ошибка HTTP: ${newRecipient.status}`);
                return;
            }
            const Recipientdata = await newRecipient.json();
            recipient = Recipientdata;
            const {data: orderCart, totalSum} = await createOrderCart(userId, goods);
            const payments = await fetch(`https://5.35.124.24:5000/api/payments`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!payments.ok) {
                throw new Error(`Ошибка HTTP: ${payments.status}`);
            }
            const paymentsData = await payments.json();
            const paymentData = paymentsData.filter(item => item.title == payment)[0];
            const deliveries = await fetch(`https://5.35.124.24:5000/api/deliveries`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!deliveries.ok) {
                throw new Error(`Ошибка HTTP: ${deliveries.status}`);
            }
            const deliveriesData = await deliveries.json();
            const deliveryData = deliveriesData.filter(item => item.title == deliveryType)[0];
            const checkout = await fetch(`https://5.35.124.24:5000/api/checkouts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'userId': userId,
                    'recipientId': recipient.id,
                    'cartId': orderCart.cart_id,
                    'paymentId': paymentData.id,
                    'deliveryId': deliveryData.id,
                    'paymentTotal': totalSum
                })
            });
            if (!checkout.ok) {
                throw new Error(`Ошибка HTTP: ${checkout.status}`);
                return;
            }
            const checkoutData = await checkout.json();
            for (const good of goods) {
                const metricResponse = await fetch(`https://5.35.124.24:5000/api/metrics/${good.goods_id}`,{
                    method:'PATCH',
                    headers : {
                        'Content-Type':'application/json'
                    },
                    body : JSON.stringify({
                        'views':0,
                        'addToCartCount': 0,
                        'orderCount':1,
                        'addToFavoritesCount':0
                    })
                });
                if (!metricResponse.ok) {
                    console.log(metricResponse);
                }
                const ret = await metricResponse.json();
                const editGood = await getGood(good.goods_id);
                const editGoodResponse = await fetch(`https://5.35.124.24:5000/api/goods/${good.goods_id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        'name': editGood.name,
                        'description': editGood.description,
                        'price': editGood.price,
                        'category_id': editGood.category_id,
                        'photos': editGood.photos,
                        'article': editGood.article,
                        'discount': editGood.discount,
                        'brand': editGood.brand,
                        'stock': editGood.stock - good.count
                     })
                });
                if (!editGoodResponse.ok) {
                    throw new Error(`Ошибка HTTP: ${editGoodResponse.status}`);
                    return;
                }
                const editGoodData = await editGoodResponse.json();
                const cartResponse = await fetch(`https://5.35.124.24:5000/api/cart/${cart.cart_id}/${good.goods_id}`, {
                    method: 'DELETE'
                });
                if (!cartResponse.ok) {
                    throw new Error(`Ошибка HTTP: ${cartResponse.status}`);
                    return;
                }
                const cartData = await cartResponse.json();
            }
            alert('Заказ успешно оформлен');
            sessionStorage.removeItem('orderData');
            window.location.href = 'shop_showcase.html';
        } else {
            alert('Заполните все необходимые поля (Кроме поля "Комментарий" и "Промокод")');
            return;
        }
    });


    async function createOrderCart(userId, goods) {
        let totalSum = 0;
        const orderCart = await fetch(`https://5.35.124.24:5000/api/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'userId': userId})
            });
        if (!orderCart.ok) {
            throw new Error(`Ошибка HTTP: ${orderCart.status}`);
        }
        const data = await orderCart.json();
        for (const good of goods) {
            const cartItem = await fetch(`https://5.35.124.24:5000/api/cart/${data.cart_id}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'goodsId': good.goods_id, 'count': good.count, 'selected': true })
            });
            if (!cartItem.ok) {
                throw new Error(`Ошибка HTTP: ${cartItem.status}`);
            }
            const cartItemData = await cartItem.json();
            const goodGood = await getGood(good.goods_id);
            totalSum += Number(goodGood.price * good.count);
        }
        return {data, totalSum};
    }

    if (userId) {
        const getResponse = await fetch(`https://5.35.124.24:5000/api/users/${userId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!getResponse.ok) {
            throw new Error(`Ошибка HTTP: ${getResponse.status}`);
        }
        const data = await getResponse.json();
        const fullName = data.name;
        userName.value = fullName ? fullName : '';
        userEmail.value = data.email;
    } else {
        userName.value = '';
        userEmail.value = '';
    }
    
    async function getCart(userId) {
        try{
            const response = await fetch(`https://5.35.124.24:5000/api/cart/user/${userId}`);
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            const cart = data.filter(item => item.main == true)[0];
            return cart;
        } catch(error){
            console.error(error);
            return null;
        }
    }

    async function openCart(){
        const orderGoods = document.querySelector('.orderGoods');
        orderGoods.innerHTML = '';
        if (userId) {
            const cart = await getCart(userId);
            if (cart.items.length == 0){
                alert('Ваша корзина пуста');
                window.location.href = 'shop_showcase.html';
                return;
            }
            let intSum = 0;
            for (const item of cart.items) {
                const {card,intSumNew} = await createCartCard(item, intSum, cart.cart_id);
                intSum = intSumNew;
                orderGoods.appendChild(card);
            };
            const totalSum = document.getElementById('totalSum');
            totalSum.textContent = `Сумма заказа: ${intSum} ₽`;
        } else {
            const cartData = JSON.parse(localStorage.getItem('cartData'));
            let intSum = 0;
            if (cartData.items.length == 0){
                alert('Ваша корзина пуста');
                window.location.href = 'shop_showcase.html';
                return;
            }
            for (const item of cartData.items) {
                const {card,intSumNew} = await createCartCard(item, intSum);
                intSum = intSumNew;
                orderGoods.appendChild(card);
            };
            const totalSum = document.getElementById('totalSum');
            totalSum.textContent = `Сумма заказа: ${intSum} ₽`;
        }
    }

    const closeAll = document.getElementById('closeAll');
    const selectAll = document.getElementById('selectAll');
    closeAll.addEventListener('click', async function() {
        const orderGoods = document.querySelector('.orderGoods');
        const allSelected = orderGoods.querySelectorAll('.inputCheck:checked');
        for (const item of allSelected) {
            const card = item.closest('.cartItem');
            const itemId = card.dataset.id;
            if (userId) {
                const cart = await getCart(userId);
                const cartId = cart.cart_id;
                const response = await fetch(`https://5.35.124.24:5000/api/cart/${cartId}/${itemId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                const data = await response.json();
            } else {
                const cartData = JSON.parse(localStorage.getItem('cartData'));
                const cartItemIndex = cartData.items.findIndex(item => item.goods_id == itemId);
                cartData.items.splice(cartItemIndex, 1);
                localStorage.setItem('cartData', JSON.stringify(cartData));
            }
            const metricResponse = await fetch(`https://5.35.124.24:5000/api/metrics/${itemId}`,{
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
            alert('Товар успешно удален из корзины');
        }
        window.location.reload();
    });
    selectAll.addEventListener('click', function() {
        const orderGoods = document.querySelector('.orderGoods');
        const checkboxes = orderGoods.querySelectorAll('.inputCheck');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
            checkbox.dispatchEvent(new Event('change'));
        });
    });

    function updateSelectAll(){
        const orderGoods = document.querySelector('.orderGoods');
        const checkboxes = orderGoods.querySelectorAll('.inputCheck');
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        selectAll.checked = allChecked;
    }
    
    document.querySelector('.orderGoods').addEventListener('change', function(event) { 
        if (event.target.classList.contains('inputCheck')){
            updateSelectAll();
        }
    });
    

    async function createCartCard(item, intSum, cartId) {
        const card = document.createElement('div');
        card.classList.add('cartItem');
        card.setAttribute('data-id',item.goods_id)
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
            } else {
                const cartData = JSON.parse(localStorage.getItem('cartData'));
                const cartItemIndex = cartData.items.findIndex(item => item.goods_id == item.goods_id);
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
                const cartItemIndex = cartData.items.findIndex(item => item.goods_id == item.goods_id);
                cartData.items[cartItemIndex].count -= 1;                
                localStorage.setItem('cartData', JSON.stringify(cartData));
            }
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
                const cartItemIndex = cartData.items.findIndex(item => item.goods_id == item.goods_id);
                cartData.items[cartItemIndex].count += 1;
                localStorage.setItem('cartData', JSON.stringify(cartData));
            }
            openCart();
        });
        itemCount.appendChild(increment);
        card.appendChild(imgTextContent);
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
            alert('Товар успешно удален из корзины');
            window.location.reload();
        });
        card.appendChild(cross);
        return {card, intSumNew: intSum};
    }    
    openCart();
});


async function getGood(id) {
    try{
        const response = await fetch(`https://5.35.124.24:5000/api/goods/${id}`);
        if (!response.ok){
            throw new Error(`Ошибка: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
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