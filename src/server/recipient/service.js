import db from "../db/db.js"

export default class RecipientService {
    static async getRecipientById(id) {
        const result = await db.query(
            "SELECT * FROM recipients WHERE id = $1",
            [id]
        )
        if (!result.rows[0]) throw new Error("Recipient not found")
        return result.rows[0]
    }

    static async getAllRecipients() {
        const result = await db.query("SELECT * FROM recipients")
        return result.rows
    }

    static async createRecipient(
        userId,
        firstName,
        lastName,
        middleName,
        address,
        zipCode,
        phone
    ) {
        const result = await db.query(
            "INSERT INTO recipients (user_id, first_name, last_name, middle_name, address, zip_code, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [userId, firstName, lastName, middleName, address, zipCode, phone]
        )
        return result.rows[0]
    }

    static async updateRecipient(
        id,
        userId,
        firstName,
        lastName,
        middleName,
        address,
        zipCode,
        phone
    ) {
        const result = await db.query(
            "UPDATE recipients SET user_id = $1, first_name = $2, last_name = $3, middle_name = $4, address = $5, zip_code = $6, phone = $7 WHERE id = $8 RETURNING *",
            [
                userId,
                firstName,
                lastName,
                middleName,
                address,
                zipCode,
                phone,
                id,
            ]
        )
        if (!result.rows[0]) throw new Error("Recipient not found")
        return result.rows[0]
    }

    static async deleteRecipient(id) {
        const result = await db.query(
            "DELETE FROM recipients WHERE id = $1 RETURNING *",
            [id]
        )
        if (!result.rows[0]) throw new Error("Recipient not found")
    }
}
