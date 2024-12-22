import db from "../db/db.js"

export default class NewsService {
    static async getNewsById(id) {
        const result = await db.query("SELECT * FROM news WHERE id = $1", [id])
        if (!result.rows[0]) throw new Error("News not found")
        return result.rows[0]
    }

    static async getAllNews() {
        const result = await db.query("SELECT * FROM news")
        return result.rows
    }

    static async createNews(title, content, photos) {
        const result = await db.query(
            "INSERT INTO news (title, content, photos) VALUES ($1, $2, $3) RETURNING *",
            [title, content, photos]
        )
        return result.rows[0]
    }

    static async updateNews(id, title, content, photos) {
        const result = await db.query(
            "UPDATE news SET title = $1, content = $2, photos = $3 WHERE id = $4 RETURNING *",
            [title, content, photos, id]
        )
        if (!result.rows[0]) throw new Error("News not found")
        return result.rows[0]
    }

    static async deleteNews(id) {
        const result = await db.query(
            "DELETE FROM news WHERE id = $1 RETURNING *",
            [id]
        )
        if (!result.rows[0]) throw new Error("News not found")
    }
}
