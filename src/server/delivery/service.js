import db from "../db/db.js"

export default class DeliveryService {
    static async getDeliveryById(id) {
        const result = await db.query("SELECT * FROM delivery WHERE id = $1", [
            id,
        ])
        if (!result.rows[0]) throw new Error("Delivery method not found")
        return result.rows[0]
    }

    static async getAllDeliveries() {
        const result = await db.query("SELECT * FROM delivery")
        return result.rows
    }

    static async createDelivery(title, description, logo) {
        const result = await db.query(
            "INSERT INTO delivery (title, description, logo) VALUES ($1, $2, $3) RETURNING *",
            [title, description, logo]
        )
        return result.rows[0]
    }

    static async updateDelivery(id, title, description, logo) {
        const result = await db.query(
            "UPDATE delivery SET title = $1, description = $2, logo = $3 WHERE id = $4 RETURNING *",
            [title, description, logo, id]
        )
        if (!result.rows[0]) throw new Error("Delivery method not found")
        return result.rows[0]
    }

    static async deleteDelivery(id) {
        const result = await db.query(
            "DELETE FROM delivery WHERE id = $1 RETURNING *",
            [id]
        )
        if (!result.rows[0]) throw new Error("Delivery method not found")
    }
}
