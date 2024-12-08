document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const login = formData.get('login');
    const password = formData.get('password1');

    if (login && password) {
        try {
            const response = await fetch('https://5.35.124.24:5000/api/auth/signup', {
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
            alert('На почту было отправлено письмо с ссылкой для активации аккаунта');
            window.location.href = 'auth_admin.html';
        } catch (error) {
            alert('Не удалось зарегистрироваться');
        }
    } else {
        alert('Заполните поля «Логин» и «Пароль»');
    }
});