import { Router } from "express"
import PaymentsController from "./controller.js"

const PaymentsRouter = Router()

// CRUD
PaymentsRouter.get("/api/payments/:id", PaymentsController.getPaymentById)
PaymentsRouter.get("/api/payments", PaymentsController.getAllPayments)
PaymentsRouter.post("/api/payments", PaymentsController.createPayment)
PaymentsRouter.patch("/api/payments/:id", PaymentsController.updatePayment)
PaymentsRouter.delete("/api/payments/:id", PaymentsController.deletePayment)

export default PaymentsRouter
