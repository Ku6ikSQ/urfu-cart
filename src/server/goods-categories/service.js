import db from "../db/db.js";

export default class GoodCategoryService {
    static async getCategoryById(id) {
        const result = await db.query("SELECT * FROM good_categories WHERE id = $1", [id]);
        if (!result.rows[0]) throw new Error("Category not found");
        return result.rows[0];
    }

    static async getAllCategories() {
        const result = await db.query("SELECT * FROM good_categories");
        return result.rows;
    }

    static async createCategory(title, description) {
        const result = await db.query(
            "INSERT INTO good_categories (title, description) VALUES ($1, $2) RETURNING *",
            [title, description]
        );
        return result.rows[0];
    }

    static async updateCategory(id, title, description) {
        const result = await db.query(
            "UPDATE good_categories SET title = $1, description = $2 WHERE id = $3 RETURNING *",
            [title, description, id]
        );
        if (!result.rows[0]) throw new Error("Category not found");
        return result.rows[0];
    }

    static async deleteCategory(id) {
        const result = await db.query("DELETE FROM good_categories WHERE id = $1 RETURNING *", [id]);
        if (!result.rows[0]) throw new Error("Category not found");
    }
}
