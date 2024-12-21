import DeliveryService from "./service.js"

export default class DeliveryController {
    static async getDeliveryById(req, res) {
        try {
            const { id } = req.params
            const delivery = await DeliveryService.getDeliveryById(id)
            return res.json(delivery)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async getAllDeliveries(req, res) {
        try {
            const deliveriesList = await DeliveryService.getAllDeliveries()
            return res.json(deliveriesList)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async createDelivery(req, res) {
        try {
            const { title, description, logo } = req.body
            const delivery = await DeliveryService.createDelivery(
                title,
                description,
                logo
            )
            return res.status(200).json(delivery)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async updateDelivery(req, res) {
        try {
            const { id } = req.params
            const { title, description, logo } = req.body
            const delivery = await DeliveryService.updateDelivery(
                id,
                title,
                description,
                logo
            )
            return res.json(delivery)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async deleteDelivery(req, res) {
        try {
            const { id } = req.params
            await DeliveryService.deleteDelivery(id)
            return res.status(200).send()
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }
}
