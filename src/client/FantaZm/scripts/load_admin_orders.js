document.addEventListener('DOMContentLoaded', async function() {
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
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function getCart(cartId) {
        try{
            const response = await fetch(`https://5.35.124.24:5000/api/cart/${cartId}`);
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

    async function getOrders() {
        try{
            const response = await fetch(`https://5.35.124.24:5000/api/checkouts`,{
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

    async function getRecipient(recipientId) {
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

    async function openOrder(order, open) {
        if (open.textContent != `\u2227`) {
            open.textContent = `\u2227`;
            order.querySelector('.order-info').style.border = 'none';
            order.querySelector('.phoneAndAddress').style.display = 'flex';
            order.querySelectorAll('.nameAndCode').forEach(nameAndCode => nameAndCode.style.display = 'flex');
            order.querySelectorAll('.priceAndQuantity').forEach(priceAndQuantity => priceAndQuantity.style.display = 'flex');
            order.querySelectorAll('.imgAndName').forEach(imgAndName => imgAndName.style.width = '50%');
            order.querySelectorAll('.goods-item-info').forEach(goodsItemInfo => {
                goodsItemInfo.style.width = '100%';
                goodsItemInfo.style.display = 'flex';
            });
            order.querySelectorAll('.goods-item img').forEach(goodsItem => goodsItem.style.width = '15%');                
            order.querySelector('.goods-item').style.flexDirection = 'column';
            order.querySelector('.order-goods').style.flexDirection = 'column';
            if (order.querySelector('.more')) {
                order.querySelector('.more').style.display = 'none';
            }
        } else {
            imgCounter = 0;
            open.textContent = `\u2228`;
            order.querySelector('.order-info').style.borderBottom = '1px solid black';
            order.querySelector('.phoneAndAddress').style.display = 'none';
            order.querySelectorAll('.nameAndCode').forEach(nameAndCode => nameAndCode.style.display = 'none');
            order.querySelectorAll('.priceAndQuantity').forEach(priceAndQuantity => priceAndQuantity.style.display = 'none');
            order.querySelectorAll('.imgAndName').forEach(imgAndName => imgAndName.style.width = 'auto');
            order.querySelectorAll('.goods-item-info').forEach(goodsItemInfo => {
                goodsItemInfo.style.width = '10%';
                imgCounter++;
                if (imgCounter > 5) {
                    goodsItemInfo.style.display = 'none';
                };
            });
            order.querySelectorAll('.goods-item img').forEach(goodsItem => goodsItem.style.width = '100%');
            order.querySelector('.goods-item').style.flexDirection = 'row';
            order.querySelector('.order-goods').style.flexDirection = 'row';
            if (order.querySelector('.more')) {
                order.querySelector('.more').style.display = 'block';
            }
        }
    }

    async function createOrderCard(order) {
        const card = document.createElement('div');
        card.classList.add('order');
        const orderInfo = document.createElement('div');
        orderInfo.classList.add('order-info');
        const orderInfoText = document.createElement('div');
        orderInfoText.classList.add('order-info-text');
        const orderId = document.createElement('p');
        orderId.textContent = "Заказ №" + order.id;
        orderInfoText.appendChild(orderId);
        const open = document.createElement('span');
        open.classList.add('open_arrow');
        open.id = 'open_arrow';
        open.innerHTML = '\u2228';
        orderInfo.appendChild(orderInfoText);
        orderInfo.appendChild(open);
        card.appendChild(orderInfo);
        const phoneAndAddress = document.createElement('div');
        phoneAndAddress.classList.add('phoneAndAddress');
        const recipient = await getRecipient(order.recipient_id);
        const phone = document.createElement('p');
        phone.textContent = "Телефон: " + recipient.phone;
        phoneAndAddress.appendChild(phone);
        const delivery = await getDelivery(order.delivery_id);
        const address = document.createElement('p');
        address.textContent = "Способ получения: " + delivery.logo + " по адресу: г. " + recipient.zip_code + ", " + recipient.address;
        phoneAndAddress.appendChild(address);
        const recipientName = document.createElement('p');
        recipientName.textContent = "Имя получателя: " + recipient.first_name + " " + recipient.middle_name + " " + recipient.last_name;
        phoneAndAddress.appendChild(recipientName);
        card.appendChild(phoneAndAddress);
        const orderGoods = document.createElement('div');
        orderGoods.classList.add('order-goods');
        const goodsItem = document.createElement('div');
        goodsItem.classList.add('goods-item');
        const cartData = await getCart(order.cart_id);
        for (const cartItem of cartData.items) {
            const cartGood = await getGood(cartItem.goods_id);
            const goodsItemInfo = document.createElement('div');
            goodsItemInfo.classList.add('goods-item-info');
            const imgAndName = document.createElement('div');
            imgAndName.classList.add('imgAndName');
            const img = document.createElement('img');
            img.src = await getFileLink(cartGood.photos[0]);
            imgAndName.appendChild(img);
            const nameAndCode = document.createElement('div');
            nameAndCode.classList.add('nameAndCode');
            const name = document.createElement('p');
            name.textContent = cartGood.name;
            nameAndCode.appendChild(name);
            const code = document.createElement('p');
            code.textContent = "Код товара: " + cartGood.article;
            nameAndCode.appendChild(code);
            imgAndName.appendChild(nameAndCode);
            goodsItemInfo.appendChild(imgAndName);
            const priceAndQuantity = document.createElement('div');
            priceAndQuantity.classList.add('priceAndQuantity');
            const price = document.createElement('p');
            price.textContent = "Цена: " + cartItem.count * cartGood.price;
            priceAndQuantity.appendChild(price);
            const quantity = document.createElement('p');
            quantity.textContent = cartItem.count + " шт х " + cartGood.price;
            priceAndQuantity.appendChild(quantity);
            goodsItemInfo.appendChild(priceAndQuantity);
            goodsItem.appendChild(goodsItemInfo);
        }
        orderGoods.appendChild(goodsItem);
        const goodsPrice = document.createElement('div');
        goodsPrice.classList.add('goods-price');
        const totalSum = document.createElement('p');
        totalSum.textContent = "Сумма заказа: " + order.payment_total + " ₽";
        goodsPrice.appendChild(totalSum);
        orderGoods.appendChild(goodsPrice);
        card.appendChild(orderGoods);

        open.addEventListener('click', () => openOrder(card, open)); 
        return card;
    }

    async function removeImgs() {
        const orders = document.querySelectorAll('.order');
        for (const order of orders) {
            if (order.querySelectorAll('.imgAndName img').length > 5) {
                const imgs = order.querySelectorAll('.imgAndName img');
                let imgCounter = 0;
                for (const img of imgs) {
                    imgCounter++;
                    if (imgCounter > 5) {
                        img.closest('.goods-item-info').style.display = 'none';
                    }
                }
                const more = document.createElement('p');
                more.style.alignSelf = 'center';
                more.classList.add('more');
                const countCount = imgCounter - 5;
                let goodText = '';
                if (countCount%10 == 1 && countCount != 11) {
                    goodText = ' товар';
                } else if ([2,3,4].includes(countCount%10) && !([12,13,14].includes(countCount))){  
                    goodText = ' товара';
                } else{
                    goodText = ' товаров';
                }
                more.textContent = 'Ещё ' + countCount + goodText;
                order.querySelector('.goods-item').appendChild(more);
            }
        }
    }

    async function loadOrders() {
        const orders = document.querySelector('.ordersTable');
        orders.innerHTML = '';
        const ordersData = await getOrders();
        if (ordersData.length == 0){
            orders.innerHTML = '<h2>Вы ещё не оформили ни одного заказа</h2>';
            return;
        }
        for (const order of ordersData) {
            const orderCard = await createOrderCard(order);
            orders.appendChild(orderCard);
        }
    }

    await loadOrders();
    await removeImgs();
});