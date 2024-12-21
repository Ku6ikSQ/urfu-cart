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
    data.forEach(user => {
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
        const userCity = document.createElement('p');
        userCity.classList.add('userCity');
        userCity.textContent = '';
        item.appendChild(userCity);
        const userOrder = document.createElement('p');
        userOrder.classList.add('userOrder');
        userOrder.textContent = 'Нет заказов';
        item.appendChild(userOrder);
        usersList.appendChild(item);
    });
});
