import { Router } from "express"
import DeliveryController from "./controller.js"

const DeliveryRouter = Router()

// CRUD
DeliveryRouter.get("/api/deliveries/:id", DeliveryController.getDeliveryById)
DeliveryRouter.get("/api/deliveries", DeliveryController.getAllDeliveries)
DeliveryRouter.post("/api/deliveries", DeliveryController.createDelivery)
DeliveryRouter.patch("/api/deliveries/:id", DeliveryController.updateDelivery)
DeliveryRouter.delete("/api/deliveries/:id", DeliveryController.deleteDelivery)

export default DeliveryRouter
