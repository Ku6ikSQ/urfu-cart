import TransactionService from "./service.js"

export default class TransactionController {
    static async getTransactionById(req, res) {
        try {
            const { id } = req.params
            const transaction = await TransactionService.getTransactionById(id)
            return res.json(transaction)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async getAllTransactions(req, res) {
        try {
            const transactionsList =
                await TransactionService.getAllTransactions()
            return res.json(transactionsList)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async createTransaction(req, res) {
        try {
            const { status, amount, checkoutId, providerData } = req.body
            const transaction = await TransactionService.createTransaction(
                status,
                amount,
                checkoutId,
                providerData
            )
            return res.status(200).json(transaction)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async updateTransaction(req, res) {
        try {
            const { id } = req.params
            const { status, amount, providerData } = req.body
            const transaction = await TransactionService.updateTransaction(
                id,
                status,
                amount,
                providerData
            )
            return res.json(transaction)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async deleteTransaction(req, res) {
        try {
            const { id } = req.params
            await TransactionService.deleteTransaction(id)
            return res.status(200).send()
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }
}
