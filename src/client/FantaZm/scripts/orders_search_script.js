document.addEventListener('DOMContentLoaded', async function () {
    const searchName = document.getElementById('searchName');
    const searchPriceFrom = document.getElementById('searchPriceFrom');
    const searchPriceTo = document.getElementById('searchPriceTo');
    const searchOrder = document.getElementById('searchOrder');
    const orderContainer = document.getElementById('ordersTable');
    const orderCards = orderContainer.getElementsByClassName('order');

    const filterOrders = () => {
        const nameQuery = searchName.value.toLowerCase();
        const priceFromQuery = parseFloat(searchPriceFrom.value) || 0;
        const priceToQuery = parseFloat(searchPriceTo.value) || Infinity;
        const orderQuery = searchOrder.value;
        Array.from(orderCards).forEach(orderCard => {
            const orderInfo = orderCard.querySelector('.order-info-text');
            const goodsItems = orderCard.querySelectorAll('.goods-item-info');
            const totalPriceElement = orderCard.querySelector('.goods-price p');
            let matchesName = !nameQuery;
            let matchesPrice = true;
            let matchesOrder = !orderQuery;
            const orderNumber = orderInfo.querySelector('p:first-child').textContent;
            if (orderNumber.includes(orderQuery)) {
                matchesOrder = true;
            }
            for (const goodsItem of goodsItems) {
                const goodsName = goodsItem.querySelector('.nameAndCode p:first-child').textContent.toLowerCase();
                const goodsCode = goodsItem.querySelector('.nameAndCode p:last-child').textContent.toLowerCase();
                if (goodsName.includes(nameQuery) || goodsCode.includes(nameQuery)) {
                    matchesName = true;
                }
            }
            if (totalPriceElement){
                const totalPrice = parseFloat(totalPriceElement.textContent.replace(/[^\d.]/g, '')) || 0;
                matchesPrice = totalPrice >= priceFromQuery && totalPrice <= priceToQuery;
            }
            if (matchesName && matchesPrice && matchesOrder) {
                orderCard.style.display = 'flex';
            } else {
                orderCard.style.display = 'none';
            }
        });
    };
    searchName.addEventListener('input', filterOrders);
    searchPriceFrom.addEventListener('input', filterOrders);
    searchPriceTo.addEventListener('input', filterOrders);
    searchOrder.addEventListener('input', filterOrders);

    filterOrders();
});