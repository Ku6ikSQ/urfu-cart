import db from "../db/db.js"

export default class TransactionService {
    static async getTransactionById(id) {
        const result = await db.query(
            "SELECT * FROM transactions WHERE id = $1",
            [id]
        )
        if (!result.rows[0]) throw new Error("Transaction not found")
        return result.rows[0]
    }

    static async getAllTransactions() {
        const result = await db.query("SELECT * FROM transactions")
        return result.rows
    }

    static async createTransaction(status, amount, checkoutId, providerData) {
        const result = await db.query(
            "INSERT INTO transactions (status, amount, checkout_id, provider_data) VALUES ($1, $2, $3, $4) RETURNING *",
            [status, amount, checkoutId, providerData]
        )
        return result.rows[0]
    }

    static async updateTransaction(id, status, amount, providerData) {
        const result = await db.query(
            "UPDATE transactions SET status = $1, amount = $2, provider_data = $3 WHERE id = $4 RETURNING *",
            [status, amount, providerData, id]
        )
        if (!result.rows[0]) throw new Error("Transaction not found")
        return result.rows[0]
    }

    static async deleteTransaction(id) {
        const result = await db.query(
            "DELETE FROM transactions WHERE id = $1 RETURNING *",
            [id]
        )
        if (!result.rows[0]) throw new Error("Transaction not found")
    }
}
