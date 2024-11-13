import db from "../db/db.js"
import * as argon2 from "argon2"
import { serverURL } from "../index.js"
import { sendMail } from "../mail/service.js"
import { validateEmail, validatePassword } from "../utils.js"

async function sendConfirm(email, id) {
    // this link routes to site and there's sending the request to the server (AuthService.confirm)
    const confirmURL = `${serverURL}/auth/confirm?id=${id}`
    // send this URL to email
    await sendMail(email, confirmURL)
}

const NOT_ACTIVATED = 0
const ACTIVATED = 1

export default class AuthService {
    static async confirm(id) {
        const user = await db.query("SELECT * FROM users WHERE id = $1", [id])
        if (!user.rows || !user.rows[0])
            throw new Error("Failed to find a user with this id")
        await db.query(
            "UPDATE users SET activated = $1 WHERE id = $2 RETURNING *",
            [ACTIVATED, id]
        )
    }

    static async signUp(email, password) {
        if (
            !email ||
            !password ||
            !validateEmail(email) ||
            !validatePassword(password)
        )
            throw new Error("Invalid input")
        // check that not exists confirmed user with this email
        const matches = await db.query(
            "SELECT * FROM users WHERE email = $1 AND activated = $2",
            [email, ACTIVATED]
        )
        if (matches && matches.rows && matches.rows.length)
            throw new Error("This email already had been reversed")
        const hashedPassword = await argon2.hash(password)
        const user = await db.query(
            "INSERT INTO users (email, password, activated) values ($1, $2, $3) RETURNING *",
            [email, hashedPassword, NOT_ACTIVATED]
        )
        // sending the message to email
        await sendConfirm(email, user.rows[0].id)
        return user.rows[0]
    }

    static async signIn(email, password) {
        if (!email || !password) throw new Error("Invalid input")
        const record = await db.query("SELECT * FROM users WHERE email = $1", [
            email,
        ])
        if (!record.rows[0]) throw new Error("Failed to find this user")
        if (record.rows[0].activated != ACTIVATED)
            throw new Error("This user is not activated")
        const correctPassword = await argon2.verify(
            record.rows[0].password,
            password
        )
        if (!correctPassword) throw new Error("Failed to authorization")
    }
}
