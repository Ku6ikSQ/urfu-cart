import db from "../db/db.js"

export default class MetricsService {
    static async getMetricsByGoodsId(goodsId) {
        const result = await db.query(
            "SELECT * FROM metrics WHERE goods_id = $1",
            [goodsId]
        )
        if (!result.rows[0]) throw new Error("Metrics not found")
        return result.rows
    }

    static async createMetrics(goodsId) {
        const existingMetrics = await db.query(
            "SELECT * FROM metrics WHERE goods_id = $1 AND metric_date = CURRENT_DATE",
            [goodsId]
        )
        if (existingMetrics.rows.length > 0)
            throw new Error("Metrics already exist for this goodsId today")

        const result = await db.query(
            "INSERT INTO metrics (goods_id, views, add_to_cart_count, order_count, add_to_favorites_count, metric_date) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE) RETURNING *",
            [goodsId, 0, 0, 0, 0]
        )
        return result.rows[0]
    }

    static async updateMetrics(
        goodsId,
        views,
        addToCartCount,
        orderCount,
        addToFavoritesCount
    ) {
        const result = await db.query(
            "UPDATE metrics SET views = views + $1, add_to_cart_count = add_to_cart_count + $2, order_count = order_count + $3, add_to_favorites_count = add_to_favorites_count + $4 WHERE goods_id = $5 AND metric_date = CURRENT_DATE RETURNING *",
            [views, addToCartCount, orderCount, addToFavoritesCount, goodsId]
        )
        if (!result.rows[0]) {
            await this.createMetrics(goodsId)
            const result = await db.query(
                "UPDATE metrics SET views = $1, add_to_cart_count = $2, order_count = $3, add_to_favorites_count = $4 WHERE goods_id = $5 AND metric_date = CURRENT_DATE RETURNING *",
                [
                    views,
                    addToCartCount,
                    orderCount,
                    addToFavoritesCount,
                    goodsId,
                ]
            )
            if (!result.rows[0]) throw new Error("Metrics not found for today")
            return result.rows[0]
        }
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
