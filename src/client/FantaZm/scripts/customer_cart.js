document.addEventListener('DOMContentLoaded', function() {
    const login = document.getElementById('login');
    const register = document.getElementById('register');
    const cabinet = document.getElementById('cabinet');
    const cart = document.getElementById('customerCart');
    const cartButton = document.getElementById('cartButton');
    function openCart(){
        cart.style.display = "block";
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
