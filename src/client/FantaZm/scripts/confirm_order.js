document.addEventListener('DOMContentLoaded', async function () {
    const confirmButton = document.querySelector('.confirmButton');
    const userId = sessionStorage.getItem('userId');

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

    confirmButton.addEventListener('click', async function () {
        const cartData = await getCart(userId);
        if (cartData.items.length == 0){
            alert('Ваша корзина пуста');
            window.location.href = 'shop_showcase.html';
            return;
        }
        if (!cartData.items.find(item => item.selected == true)){ 
            alert('Выберите хотя бы один товар из корзины');
            return;
        }
    });
});