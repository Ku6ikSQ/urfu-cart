document.addEventListener('DOMContentLoaded', async function () {
    const searchName = document.getElementById('searchName');
    const searchPriceFrom = document.getElementById('searchPriceFrom');
    const searchPriceTo = document.getElementById('searchPriceTo');
    const productContainer = document.getElementById('productContainer');
    const productCards = productContainer.getElementsByClassName('good_card');

    const filterProducts = () => {
        const nameQuery = searchName.value.toLowerCase();
        const priceFromQuery = parseFloat(searchPriceFrom.value) || 0;
        const priceToQuery = parseFloat(searchPriceTo.value) || Infinity;
        Array.from(productCards).forEach(productCard => {
            const productName = productCard.querySelector('p:nth-of-type(1)').textContent.toLowerCase();
            const productPrice = parseFloat(productCard.querySelector('.good_price p:nth-of-type(1)').textContent) || 0;
            const matchesName = !nameQuery || productName.includes(nameQuery);
            const matchesPrice = productPrice >= priceFromQuery && productPrice <= priceToQuery;
            if (matchesName && matchesPrice) {
                productCard.style.display = 'flex';
            } else {
                productCard.style.display = 'none';
            }
        });
    };
    searchName.addEventListener('input', filterProducts);
    searchPriceFrom.addEventListener('input', filterProducts);
    searchPriceTo.addEventListener('input', filterProducts);
    filterProducts();
});