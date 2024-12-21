import CheckoutService from "./service.js"

export default class CheckoutController {
    static async getCheckoutById(req, res) {
        try {
            const { id } = req.params
            const checkout = await CheckoutService.getCheckoutById(id)
            return res.json(checkout)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async getAllCheckouts(req, res) {
        try {
            const checkoutList = await CheckoutService.getAllCheckouts()
            return res.json(checkoutList)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async createCheckout(req, res) {
        try {
            const {
                userId,
                recipientId,
                cartId,
                paymentId,
                deliveryId,
                paymentTotal,
            } = req.body
            const checkout = await CheckoutService.createCheckout(
                userId,
                recipientId,
                cartId,
                paymentId,
                deliveryId,
                paymentTotal
            )
            return res.status(200).json(checkout)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async updateCheckout(req, res) {
        try {
            const { id } = req.params
            const {
                userId,
                recipientId,
                cartId,
                paymentId,
                deliveryId,
                paymentTotal,
            } = req.body
            const checkout = await CheckoutService.updateCheckout(
                id,
                userId,
                recipientId,
                cartId,
                paymentId,
                deliveryId,
                paymentTotal
            )
            return res.json(checkout)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async deleteCheckout(req, res) {
        try {
            const { id } = req.params
            await CheckoutService.deleteCheckout(id)
            return res.status(200).send()
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }
}
