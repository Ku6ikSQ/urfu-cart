import PaymentsService from "./service.js"

export default class PaymentsController {
    static async getPaymentById(req, res) {
        try {
            const { id } = req.params
            const payment = await PaymentsService.getPaymentById(id)
            return res.json(payment)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async getAllPayments(req, res) {
        try {
            const paymentsList = await PaymentsService.getAllPayments()
            return res.json(paymentsList)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async createPayment(req, res) {
        try {
            const { title, description, logo } = req.body
            const payment = await PaymentsService.createPayment(
                title,
                description,
                logo
            )
            return res.status(200).json(payment)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async updatePayment(req, res) {
        try {
            const { id } = req.params
            const { title, description, logo } = req.body
            const payment = await PaymentsService.updatePayment(
                id,
                title,
                description,
                logo
            )
            return res.json(payment)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async deletePayment(req, res) {
        try {
            const { id } = req.params
            await PaymentsService.deletePayment(id)
            return res.status(200).send()
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }
}
