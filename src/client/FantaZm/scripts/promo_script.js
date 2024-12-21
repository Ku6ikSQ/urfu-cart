document.addEventListener('DOMContentLoaded', () => {
    const promo = document.querySelector('.promo');
    const promoButton = document.querySelector('.promo button');
    const promoInput = document.querySelector('.promo input');

    promoInput.addEventListener('focus', () => {
        promoButton.style.flexDirection = 'row';
        promoButton.style.display = 'block';
        promoInput.style.width = '50%';
    });

}); 