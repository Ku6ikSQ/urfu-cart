document.addEventListener('DOMContentLoaded', async function () {
    const usersList = document.querySelector('.usersList-content');
    usersList.innerHTML = '';
    const response = await fetch(`https://5.35.124.24:5000/api/users`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    const filteredData = data.filter(user => user.activated == 1);
    for (const user of filteredData) {
        const item = document.createElement('div');
        item.classList.add('usersList-item');
        const userId = document.createElement('p');
        userId.classList.add('userId');
        userId.textContent = user.id;
        item.appendChild(userId);
        const userEmail = document.createElement('p');
        userEmail.classList.add('userEmail');
        userEmail.textContent = user.email;
        item.appendChild(userEmail);
        const userName = document.createElement('p');
        userName.classList.add('userName');
        userName.textContent = user.name ? user.name : '';
        item.appendChild(userName);
        const userOrder = document.createElement('p');
        userOrder.classList.add('userOrder');
        const orders = await getUserOrders(user.id);
        if (orders.length == 0) {
            userOrder.textContent = 'Нет заказов';
        } else if (orders.length == 1) {
            userOrder.textContent = "Заказ №" + orders[0].id;
        } else {
            const orderIds = orders.map(order => order.id);
            userOrder.textContent = "Заказы №" + orderIds.join(', ');
        }
        item.appendChild(userOrder);
        usersList.appendChild(item);
    }
});

async function getUserOrders(userId) {
    const response = await fetch(`https://5.35.124.24:5000/api/checkouts`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data.filter(item => item.user_id == userId);
}