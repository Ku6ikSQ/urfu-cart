import { Router } from "express"
import CheckoutController from "./controller.js"

const CheckoutRouter = Router()

// CRUD
CheckoutRouter.get("/api/checkouts/:id", CheckoutController.getCheckoutById)
CheckoutRouter.get("/api/checkouts", CheckoutController.getAllCheckouts)
CheckoutRouter.post("/api/checkouts", CheckoutController.createCheckout)
CheckoutRouter.patch("/api/checkouts/:id", CheckoutController.updateCheckout)
CheckoutRouter.delete("/api/checkouts/:id", CheckoutController.deleteCheckout)

export default CheckoutRouter
