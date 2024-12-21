document.addEventListener('DOMContentLoaded', function () {
    const searchEmail = document.getElementById('searchEmail');
    const searchName = document.getElementById('searchName');
    const searchCity = document.getElementById('searchCity');
    const searchButton = document.getElementById('searchButton');
    searchEmail.value = '';
    searchName.value = '';
    searchCity.value = '';
    searchButton.addEventListener('click', async function () {
        const email = searchEmail.value || '';
        const name = searchName.value || '';
        const city = searchCity.value || '';
        console.log(email,name,city);
        if (email=='' && name=='' && city==''){
            return;
        }
        const response = await fetch('https://5.35.124.24:5000/api/users');
        if (!response.ok){
            throw new Error(`Ошибка: ${response.status}`);
        }
        let data = await response.json();
        if (email){
            data = data.filter(user => user.email.toLowerCase().includes(email.toLowerCase()));
        }
        if (name){
            data = data.filter(user => { return user.name && user.name.toLowerCase().includes(name.toLowerCase())});
        }
        console.log(data);
        const container = document.getElementById('usersList');
        container.innerHTML = '';
        if (data.length > 0){
            for (const user of data) {
                const card = await createUserCard(user);
                container.appendChild(card);
            }
        }
    });
});

async function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'usersList-item';
    card.setAttribute('data-id', user.id.toString());

    card.innerHTML = `
        <p class="userId">${user.id}</p>
        <p class="userEmail">${user.email}</p>
        <p class="userName">${user.name}</p>
        <p class="userCity"></p>
        <p class="userOrder">Нет заказов</p>
    `;
    return card;
}