import db from "../db/db.js"

export default class CheckoutService {
    static async getCheckoutById(id) {
        const result = await db.query("SELECT * FROM checkouts WHERE id = $1", [
            id,
        ])
        if (!result.rows[0]) throw new Error("Checkout not found")
        return result.rows[0]
    }

    static async getAllCheckouts() {
        const result = await db.query("SELECT * FROM checkouts")
        return result.rows
    }

    static async createCheckout(
        userId,
        recipientId,
        cartId,
        paymentId,
        deliveryId,
        paymentTotal
    ) {
        const result = await db.query(
            "INSERT INTO checkouts (user_id, recipient_id, cart_id, payment_id, delivery_id, payment_total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [userId, recipientId, cartId, paymentId, deliveryId, paymentTotal]
        )
        return result.rows[0]
    }

    static async updateCheckout(
        id,
        userId,
        recipientId,
        cartId,
        paymentId,
        deliveryId,
        paymentTotal
    ) {
        const result = await db.query(
            "UPDATE checkouts SET user_id = $1, recipient_id = $2, cart_id = $3, payment_id = $4, delivery_id = $5, payment_total = $6 WHERE id = $7 RETURNING *",
            [
                userId,
                recipientId,
                cartId,
                paymentId,
                deliveryId,
                paymentTotal,
                id,
            ]
        )
        if (!result.rows[0]) throw new Error("Checkout not found")
        return result.rows[0]
    }

    static async deleteCheckout(id) {
        const result = await db.query(
            "DELETE FROM checkouts WHERE id = $1 RETURNING *",
            [id]
        )
        if (!result.rows[0]) throw new Error("Checkout not found")
    }
}
