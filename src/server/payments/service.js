import db from "../db/db.js"

export default class PaymentsService {
    static async getPaymentById(id) {
        const result = await db.query("SELECT * FROM payments WHERE id = $1", [
            id,
        ])
        if (!result.rows[0]) throw new Error("Payment method not found")
        return result.rows[0]
    }

    static async getAllPayments() {
        const result = await db.query("SELECT * FROM payments")
        return result.rows
    }

    static async createPayment(title, description, logo) {
        const result = await db.query(
            "INSERT INTO payments (title, description, logo) VALUES ($1, $2, $3) RETURNING *",
            [title, description, logo]
        )
        return result.rows[0]
    }

    static async updatePayment(id, title, description, logo) {
        const result = await db.query(
            "UPDATE payments SET title = $1, description = $2, logo = $3 WHERE id = $4 RETURNING *",
            [title, description, logo, id]
        )
        if (!result.rows[0]) throw new Error("Payment method not found")
        return result.rows[0]
    }

    static async deletePayment(id) {
        const result = await db.query(
            "DELETE FROM payments WHERE id = $1 RETURNING *",
            [id]
        )
        if (!result.rows[0]) throw new Error("Payment method not found")
    }
}
