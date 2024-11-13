// there's a processing of headers and returning of responses

import AuthService from "./service.js"

export default class AuthController {
    static async confirm(req, res) {
        try {
            const { id } = req.query
            await AuthService.confirm(id)
            return res.status(200).json("Confirmation successful")
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async signUp(req, res) {
        try {
            const { email, password } = req.body
            const user = await AuthService.signUp(email, password)
            return res.json(user)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async signIn(req, res) {
        try {
            const { email, password } = req.body
            await AuthService.signIn(email, password)
            return res.status(200).json("Authorization successful")
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }
}
