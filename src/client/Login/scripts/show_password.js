document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    if (passwordInput === null) {
        const passwordInput1 = document.getElementById("password1");
        const passwordInput2 = document.getElementById("password2");
        const togglePassword1 = document.getElementById("togglePassword1");
        const togglePassword2 = document.getElementById("togglePassword2");
        togglePassword1.addEventListener("click", () => {
            const type1 = passwordInput1.getAttribute("type") === "password" ? "text" : "password";
            passwordInput1.setAttribute("type", type1);
            togglePassword1.src = type1 === "password" ? "assets/open_eye.png" : "assets/closed_eye.png";});
        togglePassword2.addEventListener("click", () => {
            const type2 = passwordInput2.getAttribute("type") === "password" ? "text" : "password";
            passwordInput2.setAttribute("type", type2);
            togglePassword2.src = type2 === "password" ? "assets/open_eye.png" : "assets/closed_eye.png";
        });
    }
    else {
        togglePassword.addEventListener("click", () => {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);

            togglePassword.src = type === "password" ? "assets/open_eye.png" : "assets/closed_eye.png";
        });
    }
});
