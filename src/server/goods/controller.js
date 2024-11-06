import GoodsService from "./service.js";

export default class GoodsController {
    static async getGoodsById(req, res) {
        try {
            const { id } = req.params;
            const goods = await GoodsService.getGoodsById(id);
            return res.json(goods);
        } catch (e) {
            return res.status(400).json(e.message);
        }
    }

    static async getAllGoods(req, res) {
        try {
            const goodsList = await GoodsService.getAllGoods();
            return res.json(goodsList);
        } catch (e) {
            return res.status(400).json(e.message);
        }
    }

    static async createGoods(req, res) {
        try {
            const { name, description, price, categoryId, photos } = req.body;
            const goods = await GoodsService.createGoods(name, description, price, categoryId, photos);
            return res.status(201).json(goods);
        } catch (e) {
            return res.status(400).json(e.message);
        }
    }

    static async updateGoods(req, res) {
        try {
            const { id } = req.params;
            const { name, description, price, categoryId, photos } = req.body;
            const goods = await GoodsService.updateGoods(id, name, description, price, categoryId, photos);
            return res.json(goods);
        } catch (e) {
            return res.status(400).json(e.message);
        }
    }

    static async deleteGoods(req, res) {
        try {
            const { id } = req.params;
            await GoodsService.deleteGoods(id);
            return res.status(204).send();
        } catch (e) {
            return res.status(400).json(e.message);
        }
    }
}
