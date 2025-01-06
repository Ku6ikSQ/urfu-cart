document.addEventListener('DOMContentLoaded', async function () {
    const searchEmail = document.getElementById('searchEmail');
    const searchName = document.getElementById('searchName');
    const searchOrder = document.getElementById('searchOrder');
    const usersListContent = document.querySelector('.usersList-content');

    function filterUsers() { 
        const emailQuery = searchEmail.value.toLowerCase();
        const nameQuery = searchName.value.toLowerCase();
        const orderQuery = searchOrder.value;
        const userItems = usersListContent.querySelectorAll('.usersList-item');
        userItems.forEach(userItem => {
            const userEmail = userItem.querySelector('.userEmail').textContent.toLowerCase();
            const userName = userItem.querySelector('.userName').textContent.toLowerCase();
            const userOrder = userItem.querySelector('.userOrder').textContent;
            const matchesEmail = !emailQuery || userEmail.includes(emailQuery);
            const matchesName = !nameQuery || userName.includes(nameQuery);
            const matchesOrder = !orderQuery || userOrder.includes(orderQuery);
            if (matchesEmail && matchesName && matchesOrder) {
                userItem.style.display = 'flex';
            } else {
                userItem.style.display = 'none';
            }
        });
    }

    searchEmail.addEventListener('input', filterUsers);
    searchName.addEventListener('input', filterUsers);
    searchOrder.addEventListener('input', filterUsers);

    filterUsers();
});