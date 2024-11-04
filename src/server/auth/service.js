import db from "../db/db.js";
import * as argon2 from 'argon2'
import { serverURL } from "../index.js";
import { sendMail } from "../mail/service.js";

async function sendConfirm(email, id) {
    // this link routes to site and there's sending the request to the server (AuthService.confirm)
    const confirmURL = `${serverURL}/auth/confirm?id=${id}`
    console.log(`${confirmURL} on ${email}`)
    return;
    // send this URL to email
    const res = await sendMail(email)
    console.log(res);
}

const NOT_CONFIRM = -1
const CONFIRM = 1

export default class AuthService {
    static async confirm(id) {
        const user = await db.query('SELECT * FROM users WHERE id = $1', [id])
        if(!user)
            throw new Error('Failed to confirm')
        const match = await db.query('UPDATE users SET status = $1 WHERE id = $2 RETURNING *', [CONFIRM, id])
        return !!match
    }

    static async signUp(email, password) {
        // check that not exists confirmed user with this email
        const matches = await db.query('SELECT * FROM users WHERE email = $1 AND status = $2', [email, CONFIRM])
        if(matches && matches.rows && matches.rows.length)
            throw new Error("This email already had been reserved")
        const hashedPassword = await argon2.hash(password)
        const user = await db.query('INSERT INTO users (email, password, status) values ($1, $2, $3) RETURNING *', [email, hashedPassword, NOT_CONFIRM])
        // sending the message to email
        await sendConfirm(email, user.rows[0].id)
        return user.rows[0]
    }

    static async signIn(email, password) {
        const record = await db.query('SELECT * FROM users WHERE email = $1', [email])
        if(!record.rows[0])
            throw new Error("Non-existent user")
        if(record.rows[0].status != CONFIRM)
            throw new Error("Unconfirmed user. Please, confirm it")
        const correctPassword = await argon2.verify(record.rows[0].password, password)
        return correctPassword
    }
}