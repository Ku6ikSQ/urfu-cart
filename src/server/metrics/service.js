import db from "../db/db.js"

export default class MetricsService {
    static async getMetricsByGoodsId(goodsId) {
        const result = await db.query(
            "SELECT * FROM metrics WHERE goods_id = $1",
            [goodsId]
        )
        if (!result.rows[0]) throw new Error("Metrics not found")
        return result.rows[0]
    }

    static async createMetrics(goodsId) {
        const existingMetrics = await db.query(
            "SELECT * FROM metrics WHERE goods_id = $1",
            [goodsId]
        )
        if (existingMetrics.rows.length > 0)
            throw new Error("Metrics already exist for this goodsId")

        const result = await db.query(
            "INSERT INTO metrics (goods_id, views, add_to_cart_count, order_count) VALUES ($1, $2, $3, $4) RETURNING *",
            [goodsId, 0, 0, 0]
        )
        return result.rows[0]
    }

    static async updateMetrics(goodsId, views, addToCartCount, orderCount) {
        const result = await db.query(
            "UPDATE metrics SET views = $1, add_to_cart_count = $2, order_count = $3 WHERE goods_id = $4 RETURNING *",
            [views, addToCartCount, orderCount, goodsId]
        )
        if (!result.rows[0]) throw new Error("Metrics not found")
        return result.rows[0]
    }
}
