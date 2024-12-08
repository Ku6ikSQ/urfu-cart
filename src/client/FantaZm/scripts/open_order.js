document.addEventListener('DOMContentLoaded', function() {
    const arrows = document.getElementsByClassName('open_arrow');
    Array.from(arrows).forEach(arrow => {
        arrow.addEventListener('click', function() {
            const order = arrow.closest('.order');
            if (arrow.textContent != `\u2227`) {
                arrow.textContent = `\u2227`;
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
                order.querySelector('.more').style.display = 'none';
            } else {
                imgCounter = 0;
                arrow.textContent = `\u2228`;
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
                order.querySelector('.more').style.display = 'block';
            }
        });
    });

    document.querySelectorAll('.order').forEach(order => {
        if (order.querySelector('.open_arrow').textContent == '\u2228') {
            imgCounter =0;
            textCounter =0;
            order.querySelectorAll('.goods-item-info').forEach(goodsItemInfo => {
                imgCounter++;
                if (imgCounter > 5) {
                    goodsItemInfo.style.display = 'none';
                    textCounter++;
                };
            });
            if (textCounter > 0) {
                const parent = order.querySelector('.goods-item');
                newp = document.createElement('p');
                newp.textContent = 'Ещё '+textCounter+' шт.';
                newp.classList.add('more');
                parent.appendChild(newp);
            }
        };
    });
});