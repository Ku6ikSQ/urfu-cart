export const validateEmail = (email) =>
    String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )

export const validatePassword = (pass) => pass.length >= 8

export const getRandomInt = (size) => Math.round(Math.random() * 10 ** size)

export const generatePassword = (length) => {
    const lowerCase = "abcdefghijklmnopqrstuvwxyz"
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "0123456789"
    const specialChars = "!@#$%^&*()_+[]{}|;:',.<>?"
    const allChars = lowerCase + upperCase + numbers + specialChars

    let password = ""

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length)
        password += allChars[randomIndex]
    }

    return password
}
