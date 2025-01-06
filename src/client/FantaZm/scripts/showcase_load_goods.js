document.addEventListener('DOMContentLoaded', function () {
    async function load_goods_for_showcase() {
        let cartData = localStorage.getItem('cartData');
        if (!cartData) {
            cartData = { items: [] };
            localStorage.setItem('cartData', JSON.stringify(cartData));
        } else {
            cartData = JSON.parse(cartData);
        }
        const container = document.getElementById('goodsTable');
        try{
            const response = await fetch('https://5.35.124.24:5000/api/goods');
            if (!response.ok){
                throw new Error(`Ошибка: ${response.status}`);
            }
            const data = await response.json();
            container.innerHTML = '';
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
    };

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

    load_goods_for_showcase();
});