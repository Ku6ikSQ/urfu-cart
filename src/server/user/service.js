import db from "../db/db.js"

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
        const result = await db.query(
            "INSERT INTO users (name, email, password, activated) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, password, 0] // By default, user is not activated
        )
        return result.rows[0]
    }

    static async updateUser(id, name, email, password, activated) {
        const result = await db.query(
            "UPDATE users SET name = $1, email = $2, password = $3, activated = $4 WHERE id = $5 RETURNING *",
            [name, email, password, activated, id]
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
