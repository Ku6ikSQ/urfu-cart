import GoodsService from "./service.js"

export default class GoodsController {
    static async getGoodsById(req, res) {
        try {
            const { id } = req.params
            const goods = await GoodsService.getGoodsById(id)
            return res.json(goods)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async getAllGoods(req, res) {
        try {
            const goodsList = await GoodsService.getAllGoods()
            return res.json(goodsList)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async createGoods(req, res) {
        try {
            const {
                name,
                description,
                price,
                category_id,
                photos,
                article,
                discount,
            } = req.body
            const goods = await GoodsService.createGoods(
                name,
                description,
                price,
                category_id,
                photos,
                article,
                discount
            )
            return res.status(200).json(goods)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async updateGoods(req, res) {
        try {
            const { id } = req.params
            const {
                name,
                description,
                price,
                category_id,
                photos,
                article,
                discount,
            } = req.body
            const goods = await GoodsService.updateGoods(
                id,
                name,
                description,
                price,
                category_id,
                photos,
                article,
                discount
            )
            return res.json(goods)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async deleteGoods(req, res) {
        try {
            const { id } = req.params
            await GoodsService.deleteGoods(id)
            return res.status(200).send()
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }
}
