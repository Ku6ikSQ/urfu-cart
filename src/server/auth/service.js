import db from "../db/db.js";
import * as argon2 from 'argon2'

export default class AuthService {
    static async signUp(email, password) {
        const hashedPassword = await argon2.hash(password)
        const user = await db.query('INSERT INTO users (email, password) values ($1, $2) RETURNING *', [email, hashedPassword])
        return user.rows[0]
    }

    static async signIn(email, password) {
        const record = await db.query('SELECT * FROM users WHERE email = $1', [email])
        if(!record.rows[0])
            return 0
        const correctPassword = await argon2.verify(record.rows[0].password, password)
        return correctPassword
    }
}