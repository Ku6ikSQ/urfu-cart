import * as argon2 from "argon2"
import db from "../db/db.js"
import { isHashedPassword, validateEmail, validatePassword } from "../utils.js"

export default class UserService {
    static async getUserById(id) {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [id])
        if (!result.rows[0]) throw new Error("User not found")
        return result.rows[0]
    }

    static async getAllUsers() {
        const result = await db.query("SELECT * FROM users")
        return result.rows
    }

    static async createUser(name, email, password) {
        if (!validateEmail(email) || !validatePassword(password))
            throw new Error("Invalid input")
        const matches = await db.query(
            "SELECT * FROM users WHERE email = $1 AND activated = $2",
            [email, 1]
        )
        if (matches && matches.rows && matches.rows.length)
            throw new Error("This email already had been reversed")
        const hashedPassword = await argon2.hash(password)
        const result = await db.query(
            "INSERT INTO users (name, email, password, activated) VALUES ($1, $2, $3, $4) RETURNING *",
            [name ? name : "", email, hashedPassword, 0]
        )
        return result.rows[0]
    }

    static async updateUser(id, name, email, password, activated) {
        const hashedPassword = isHashedPassword(password)
            ? password
            : await argon2.hash(password)
        const result = await db.query(
            "UPDATE users SET name = $1, email = $2, password = $3, activated = $4 WHERE id = $5 RETURNING *",
            [name ? name : "", email, hashedPassword, activated, id]
        )
        if (!result.rows[0]) throw new Error("User not found")
        return result.rows[0]
    }

    static async deleteUser(id) {
        const result = await db.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        )
        if (!result.rows[0]) throw new Error("User not found")
    }
}
