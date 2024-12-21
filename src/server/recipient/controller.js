import RecipientService from "./service.js"

export default class RecipientController {
    static async getRecipientById(req, res) {
        try {
            const { id } = req.params
            const recipient = await RecipientService.getRecipientById(id)
            return res.json(recipient)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async getAllRecipients(req, res) {
        try {
            const recipientsList = await RecipientService.getAllRecipients()
            return res.json(recipientsList)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async createRecipient(req, res) {
        try {
            const {
                userId,
                firstName,
                lastName,
                middleName,
                address,
                zipCode,
                phone,
            } = req.body
            const recipient = await RecipientService.createRecipient(
                userId,
                firstName,
                lastName,
                middleName,
                address,
                zipCode,
                phone
            )
            return res.status(200).json(recipient)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async updateRecipient(req, res) {
        try {
            const { id } = req.params
            const {
                userId,
                firstName,
                lastName,
                middleName,
                address,
                zipCode,
                phone,
            } = req.body
            const recipient = await RecipientService.updateRecipient(
                id,
                userId,
                firstName,
                lastName,
                middleName,
                address,
                zipCode,
                phone
            )
            return res.json(recipient)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async deleteRecipient(req, res) {
        try {
            const { id } = req.params
            await RecipientService.deleteRecipient(id)
            return res.status(200).send()
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }
}
