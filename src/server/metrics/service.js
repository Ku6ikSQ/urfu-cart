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
            "SELECT * FROM metrics WHERE goods_id = $1 AND metric_date = CURRENT_DATE",
            [goodsId]
        )
        if (existingMetrics.rows.length > 0)
            throw new Error("Metrics already exist for this goodsId today")

        const result = await db.query(
            "INSERT INTO metrics (goods_id, views, add_to_cart_count, order_count, metric_date) VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING *",
            [goodsId, 0, 0, 0]
        )
        return result.rows[0]
    }

    static async updateMetrics(goodsId, views, addToCartCount, orderCount) {
        const result = await db.query(
            "UPDATE metrics SET views = $1, add_to_cart_count = $2, order_count = $3 WHERE goods_id = $4 AND metric_date = CURRENT_DATE RETURNING *",
            [views, addToCartCount, orderCount, goodsId]
        )
        if (!result.rows[0]) throw new Error("Metrics not found for today")
        return result.rows[0]
    }

    static async getMetricsByDateRange(goodsId, startDate, endDate) {
        const result = await db.query(
            "SELECT * FROM metrics WHERE goods_id = $1 AND metric_date BETWEEN $2 AND $3",
            [goodsId, startDate, endDate]
        )
        if (result.rows.length === 0)
            throw new Error("No metrics found in this date range")
        return result.rows
    }
}
