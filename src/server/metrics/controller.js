import MetricsService from "./service.js"

export default class MetricsController {
    static async getMetricsByGoodsId(req, res) {
        try {
            const { goodsId } = req.params
            const metrics = await MetricsService.getMetricsByGoodsId(goodsId)
            return res.json(metrics)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async createMetrics(req, res) {
        try {
            const { goodsId } = req.params
            const metrics = await MetricsService.createMetrics(goodsId)
            return res.status(201).json(metrics)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async updateMetrics(req, res) {
        try {
            const { goodsId } = req.params
            const { views, addToCartCount, orderCount } = req.body
            const metrics = await MetricsService.updateMetrics(
                goodsId,
                views,
                addToCartCount,
                orderCount
            )
            return res.json(metrics)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async getMetricsByDateRange(req, res) {
        try {
            const { goodsId } = req.params
            const { startDate, endDate } = req.query
            const metrics = await MetricsService.getMetricsByDateRange(
                goodsId,
                startDate,
                endDate
            )
            return res.json(metrics)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }
}
