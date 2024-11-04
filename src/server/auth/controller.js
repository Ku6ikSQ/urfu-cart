// there's a processing of headers and returning of responses

import { validateEmail, validatePassword } from "../utils.js"
import AuthService from "./service.js"

export default class AuthController {
    static async signIn(req, res) {
        try {
            const {email, password} = req.body
            if(!email || !password)
                return res.status(400).json("Authentication failed")
            const ok = await AuthService.signIn(email, password)
            if(ok)
                return res.status(200).json("Authentication successful")
            else
                return res.status(400).json("Authentication failed")
        } catch (e) {
            return res.status(500).json(e.message)
        }
    }

    static async signUp(req, res) {
        try {
            const {email, password} = req.body
            if(!email || !password || !validateEmail(email) || !validatePassword(password))
                return res.status(400).json("Registration failed")
            const user = await AuthService.signUp(email, password)
            return res.json(user)
        } catch (e) {
            return res.status(500).json(e.message)
        }
    }
}