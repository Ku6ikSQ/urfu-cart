import db from "../db/db.js"
import { serverURL } from "../index.js"
import { sendMail } from "../mail/service.js"
import UserService from "../user/service.js"
import * as argon2 from "argon2"
import { generatePassword } from "../utils.js"

async function sendConfirm(email, id) {
    // this link routes to site and there's sending the request to the server (AuthService.confirm)
    const confirmURL = `${serverURL}/auth/confirm?id=${id}`
    // send this URL to email
    await sendMail(email, confirmURL)
}

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
        const user = await UserService.createUser(null, email, password)
        await sendConfirm(email, user.id)
        return user
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

    static async reset(id) {
        const user = await UserService.getUserById(id)
        const passwd = generatePassword(8)
        user.password = await argon2.hash(passwd)
        await UserService.updateUser(
            id,
            user.name,
            user.email,
            user.password,
            user.activated
        )
        await sendMail(user.email, passwd)
    }
}
