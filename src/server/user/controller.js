import UserService from "./service.js"

export default class UserController {
    static async getUserById(req, res) {
        try {
            const { id } = req.params
            const user = await UserService.getUserById(id)
            return res.json(user)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async getAllUsers(req, res) {
        try {
            const usersList = await UserService.getAllUsers()
            return res.json(usersList)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async createUser(req, res) {
        try {
            const { name, email, password } = req.body
            const user = await UserService.createUser(name, email, password)
            return res.status(201).json(user)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async updateUser(req, res) {
        try {
            const { id } = req.params
            const { name, email, password, activated } = req.body
            const user = await UserService.updateUser(
                id,
                name,
                email,
                password,
                activated
            )
            return res.json(user)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params
            await UserService.deleteUser(id)
            return res.status(204).send()
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }
}
