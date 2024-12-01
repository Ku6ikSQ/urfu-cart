document.addEventListener('DOMContentLoaded', () => {
    const selectOption = document.querySelector('#add[name="option"]');
    const selectTime = document.querySelector('#add1[name="time"]');
    const contentLikes = document.querySelector('.content.likes');
    const contentOrders = document.querySelector('.content.orders');
    const timeTextElements = document.querySelectorAll('.graphics h1');

    const timeMap = {
        week: '7',
        month: '30',
        three_months: '90',
        year: '365'
    };

    function toggleContent() {
        const selectedOption = selectOption.value;
        contentLikes.style.display = 'none';
        contentOrders.style.display = 'none';

        if (selectedOption === 'likes') {
            contentLikes.style.display = 'block';
        } else if (selectedOption === 'orders') {
            contentOrders.style.display = 'block';
        }

        changeTime();
    }
    function changeTime() {
        const selectedOption = selectOption.value; 
        const selectedTime = selectTime.value;
        const days = timeMap[selectedTime];

        timeTextElements.forEach((element, index) => {
            if (selectedOption === 'likes' && index === 0) {
                element.textContent = `За последние ${days} дней ваши товары набрали сколько-то там лайков`;
            } else if (selectedOption === 'orders' && index === 1) {
                element.textContent = `За последние ${days} дней на ваши товары было оформлено сколько-то заказов`;
            }
        });
    }
    selectOption.addEventListener('change', toggleContent);
    selectTime.addEventListener('change', changeTime);
    toggleContent();
});
