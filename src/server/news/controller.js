import NewsService from "./service.js"

export default class NewsController {
    static async getNewsById(req, res) {
        try {
            const { id } = req.params
            const news = await NewsService.getNewsById(id)
            return res.json(news)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async getAllNews(req, res) {
        try {
            const newsList = await NewsService.getAllNews()
            return res.json(newsList)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async createNews(req, res) {
        try {
            const { title, content, photos } = req.body
            const news = await NewsService.createNews(title, content, photos)
            return res.status(201).json(news)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async updateNews(req, res) {
        try {
            const { id } = req.params
            const { title, content, photos } = req.body
            const news = await NewsService.updateNews(
                id,
                title,
                content,
                photos
            )
            return res.json(news)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async deleteNews(req, res) {
        try {
            const { id } = req.params
            await NewsService.deleteNews(id)
            return res.status(204).send()
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }
}
