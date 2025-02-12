import GoodCategoryService from "./service.js"

export default class GoodCategoryController {
    static async getCategoryById(req, res) {
        try {
            const { id } = req.params
            const category = await GoodCategoryService.getCategoryById(id)
            return res.json(category)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async getAllCategories(req, res) {
        try {
            const categories = await GoodCategoryService.getAllCategories()
            return res.json(categories)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async createCategory(req, res) {
        try {
            const { title, description, parentId, photo } = req.body
            const category = await GoodCategoryService.createCategory(
                title,
                description,
                parentId,
                photo
            )
            return res.status(200).json(category)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async updateCategory(req, res) {
        try {
            const { id } = req.params
            const { title, description, parentId, photo } = req.body
            const category = await GoodCategoryService.updateCategory(
                id,
                title,
                description,
                parentId,
                photo
            )
            return res.json(category)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async deleteCategory(req, res) {
        try {
            const { id } = req.params
            await GoodCategoryService.deleteCategory(id)
            return res.status(200).send()
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }
}
