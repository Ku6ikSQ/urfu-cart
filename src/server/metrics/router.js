import { Router } from "express"
import MetricsController from "./controller.js"

const MetricsRouter = Router()

// CRUD
MetricsRouter.get(
    "/api/metrics/:goodsId",
    MetricsController.getMetricsByGoodsId
)
MetricsRouter.post("/api/metrics/:goodsId", MetricsController.createMetrics)
MetricsRouter.patch("/api/metrics/:goodsId", MetricsController.updateMetrics)

export default MetricsRouter
