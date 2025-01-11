document.getElementById('authForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const login = formData.get('login');
    const password = formData.get('password');

    if (login && password) {
        try {
            const response = await fetch('https://5.35.124.24:5000/api/auth/signin', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    'email' : login,
                    'password' : password
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data);
            }
            sessionStorage.setItem('isAuth',true);
            const allUsers = await fetch('https://5.35.124.24:5000/api/users');
            const allUsersData = await allUsers.json();
            const user = allUsersData.find(user => user.email === login);
            sessionStorage.setItem('userId', user.id);
            if (login == 'admin@admin.com'){
                window.location.href = 'admin_goods.html';
                return;
            }
            window.location.href = 'shop_showcase.html';
        } catch (error) {
            if (error == 'Error: Failed to find this user'){
                alert('Пользователь не найден');
            } else if (error == 'Error: Invalid input'){
                alert('Неверный логин или пароль');
            } else if (error == 'Error: This user is not activated'){
                alert('Пользователь не активирован');
            } else {
                alert('Не удалось авторизоваться');
            }
        }
    } else {
        alert('Заполните поля «Логин» и «Пароль»');
    }
});
