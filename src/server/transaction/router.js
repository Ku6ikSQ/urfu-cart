import { Router } from "express"
import TransactionController from "./controller.js"

const TransactionRouter = Router()

// CRUD
TransactionRouter.get(
    "/api/transactions/:id",
    TransactionController.getTransactionById
)
TransactionRouter.get(
    "/api/transactions",
    TransactionController.getAllTransactions
)
TransactionRouter.post(
    "/api/transactions",
    TransactionController.createTransaction
)
TransactionRouter.patch(
    "/api/transactions/:id",
    TransactionController.updateTransaction
)
TransactionRouter.delete(
    "/api/transactions/:id",
    TransactionController.deleteTransaction
)

export default TransactionRouter
