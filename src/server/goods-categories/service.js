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

    static async createCategory(title, description, parentId, photo) {
        const result = await db.query(
            "INSERT INTO goods_categories (title, description, parent_id, photo) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, description, parentId, photo]
        )
        return result.rows[0]
    }

    static async updateCategory(id, title, description, parentId, photo) {
        const result = await db.query(
            "UPDATE goods_categories SET title = $1, description = $2, parent_id = $3, photo = $4 WHERE id = $5 RETURNING *",
            [title, description, parentId, photo, id]
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
