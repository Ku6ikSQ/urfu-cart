import db from "../db/db.js";

export default class GoodsService {
    static async getGoodsById(id) {
        const result = await db.query("SELECT * FROM goods WHERE id = $1", [id])
        if (!result.rows[0]) 
            throw new Error("Goods not found")
        return result.rows[0]
    }

    // TODO: probably, it will be rewrited (later)
    static async getAllGoods() {
        const result = await db.query("SELECT * FROM goods")
        return result.rows
    }

    static async createGoods(name, description, price, categoryId, photos) {
        const result = await db.query(
            "INSERT INTO goods (name, description, price, category_id, photos) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, description, price, categoryId, photos]
        )
        return result.rows[0]
    }

    static async updateGoods(id, name, description, price, categoryId, photos) {
        const result = await db.query(
            "UPDATE goods SET name = $1, description = $2, price = $3, category_id = $4, photos = $5 WHERE id = $6 RETURNING *",
            [name, description, price, categoryId, photos, id]
        )
        if (!result.rows[0]) 
            throw new Error("Goods not found")
        return result.rows[0]
    }

    static async deleteGoods(id) {
        const result = await db.query("DELETE FROM goods WHERE id = $1 RETURNING *", [id])
        if (!result.rows[0]) 
            throw new Error("Goods not found")
    }
}
