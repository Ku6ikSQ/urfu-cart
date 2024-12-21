document.addEventListener('DOMContentLoaded', async function() {
    const savebtn = document.getElementById('saveButton');
    const nameInput = document.getElementById('nameInput');
    const surnameInput = document.getElementById('surnameInput');
    const patronymicInput = document.getElementById('patronymicInput');
    const cityInput = document.getElementById('cityInput');
    const userId = sessionStorage.getItem('userId');
    const getResponse = await fetch(`https://5.35.124.24:5000/api/users/${userId}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!getResponse.ok) {
        throw new Error(`Ошибка HTTP: ${getResponse.status}`);
    }
    const data = await getResponse.json();
    const fullName = data.name.split(' ');
    nameInput.value = fullName[1];
    surnameInput.value = fullName[0];
    patronymicInput.value = fullName[2];
    savebtn.onclick = async function() {
        const name = nameInput.value.trim() ? nameInput.value.trim() : ''; 
        const surname = surnameInput.value.trim() ? surnameInput.value.trim() : '';
        const patronymic = patronymicInput.value.trim() ? patronymicInput.value.trim() : '';
        const city = cityInput.value;
        if (name || surname || patronymic) {
            if (name === fullName[1] && surname === fullName[0] && patronymic === fullName[2]) {
                return;
            }
            const newData = {
                'name' : surname+' '+name+' '+patronymic,
                'email': data.email,
                'password': data.password,
                'activated': data.activated,
            };
            const response = await fetch(`https://5.35.124.24:5000/api/users/${userId}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData)
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            alert('Данные успешно обновлены');
            window.location.reload();
        } else {
            alert('Введите имя, фамилию и отчество');
        }
    };
});