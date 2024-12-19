document.addEventListener('DOMContentLoaded', function () {
    const searchName = document.getElementById('searchName');
    const searchBrand = document.getElementById('searchBrand');
    const searchPriceFrom = document.getElementById('searchPriceFrom');
    const searchPriceTo = document.getElementById('searchPriceTo');
    const searchButton = document.getElementById('searchButton');
    searchName.value = '';
    searchBrand.value = '';
    searchPriceFrom.value = '';
    searchPriceTo.value = '';
    searchButton.addEventListener('click', async function () {
        const name = searchName.value || '';
        const brand = searchBrand.value || '';
        const priceFrom = searchPriceFrom.value || 0;
        const priceTo = searchPriceTo.value || 1000000;
        console.log(name,priceFrom,priceTo);
        if (name=='' && priceFrom==0 && priceTo==1000000){
            return;
        }
        const response = await fetch('https://5.35.124.24:5000/api/goods');
        if (!response.ok){
            throw new Error(`Ошибка: ${response.status}`);
        }
        let data = await response.json();
        if (name){
            data = data.filter(good => good.name.toLowerCase().includes(name.toLowerCase()));
        }
        if (priceFrom!=0 && priceTo==1000000){
            data = data.filter(good => Number(good.price) >= priceFrom);
        } else if (priceFrom==0 && priceTo!==1000000){
            data = data.filter(good => Number(good.price) <= priceTo);
        } else {
            data = data.filter(good => Number(good.price) >= priceFrom && Number(good.price) <= priceTo);
        }
        console.log(data);
        const container = document.getElementById('productContainer');
        container.innerHTML = '';
        if (data.length > 0){
            for (const good of data) {
                const card = await createGoodCard(good);
                container.appendChild(card);
            } 
        }
    });
});

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

