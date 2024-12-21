import { Router } from "express"
import RecipientController from "./controller.js"

const RecipientRouter = Router()

// CRUD
RecipientRouter.get("/api/recipients/:id", RecipientController.getRecipientById)
RecipientRouter.get("/api/recipients", RecipientController.getAllRecipients)
RecipientRouter.post("/api/recipients", RecipientController.createRecipient)
RecipientRouter.patch(
    "/api/recipients/:id",
    RecipientController.updateRecipient
)
RecipientRouter.delete(
    "/api/recipients/:id",
    RecipientController.deleteRecipient
)

export default RecipientRouter
