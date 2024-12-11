import db from "../db/db.js"
import GoodCategoryService from "../goods-categories/service.js"

export default class GoodsService {
    static async getGoodsById(id) {
        const result = await db.query("SELECT * FROM goods WHERE id = $1", [id])
        if (!result.rows[0]) throw new Error("Goods not found")
        return result.rows[0]
    }

    static async getAllGoods(categoryId) {
        const query = !categoryId
            ? "SELECT * FROM goods"
            : `
            WITH RECURSIVE category_hierarchy AS (
                SELECT id
                FROM goods_categories
                WHERE id = ${categoryId}
                
                UNION ALL
                
                SELECT gc.id
                FROM goods_categories gc
                INNER JOIN category_hierarchy ch ON gc.parent_id = ch.id
            )
            SELECT g.*
            FROM goods g
            WHERE g.category_id IN (SELECT id FROM category_hierarchy);
        `
        const result = await db.query(query)
        return result.rows
    }

    static async createGoods(
        name,
        description,
        price,
        categoryId,
        photos,
        article,
        discount,
        brand,
        stock
    ) {
        const result = await db.query(
            "INSERT INTO goods (name, description, price, category_id, photos, article, discount, brand, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [
                name,
                description,
                price,
                categoryId,
                photos,
                article,
                discount,
                brand,
                stock,
            ]
        )
        return result.rows[0]
    }

    static async updateGoods(
        id,
        name,
        description,
        price,
        categoryId,
        photos,
        article,
        discount,
        brand,
        stock
    ) {
        const result = await db.query(
            "UPDATE goods SET name = $1, description = $2, price = $3, category_id = $4, photos = $5, article = $6, discount = $7, brand = $8, stock = $9 WHERE id = $10 RETURNING *",
            [
                name,
                description,
                price,
                categoryId,
                photos,
                article,
                discount,
                brand,
                stock,
                id,
            ]
        )
        if (!result.rows[0]) throw new Error("Goods not found")
        return result.rows[0]
    }

    static async deleteGoods(id) {
        const result = await db.query(
            "DELETE FROM goods WHERE id = $1 RETURNING *",
            [id]
        )
        if (!result.rows[0]) throw new Error("Goods not found")
    }
}
