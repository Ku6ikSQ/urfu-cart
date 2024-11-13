import db from "../db/db.js"

export default class GoodCategoryService {
    static async getCategoryById(id) {
        const result = await db.query(
            "SELECT * FROM goods_categories WHERE id = $1",
            [id]
        )
        if (!result.rows[0]) throw new Error("Category not found")
        return result.rows[0]
    }

    static async getAllCategories() {
        const result = await db.query("SELECT * FROM goods_categories")
        return result.rows
    }

    static async createCategory(title, description, parentId) {
        const result = await db.query(
            "INSERT INTO goods_categories (title, description, parent_id) VALUES ($1, $2, $3) RETURNING *",
            [title, description, parentId]
        )
        return result.rows[0]
    }

    static async updateCategory(id, title, description, parentId) {
        const result = await db.query(
            "UPDATE goods_categories SET title = $1, description = $2, parent_id = $3 WHERE id = $4 RETURNING *",
            [title, description, parentId, id]
        )
        if (!result.rows[0]) throw new Error("Category not found")
        return result.rows[0]
    }

    static async deleteCategory(id) {
        const result = await db.query(
            "DELETE FROM goods_categories WHERE id = $1 RETURNING *",
            [id]
        )
        if (!result.rows[0]) throw new Error("Category not found")
    }
}
