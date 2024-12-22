import FavoritesService from "./service.js"

export default class FavoritesController {
    static async getFavorites(req, res) {
        try {
            const { userId } = req.params
            const favorites = await FavoritesService.getFavoritesByUserId(
                userId
            )
            return res.json(favorites)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async addItem(req, res) {
        try {
            const { userId } = req.params
            const { goodsId } = req.body
            const favorites = await FavoritesService.addItemToFavorites(
                userId,
                goodsId
            )
            return res.json(favorites)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async removeItem(req, res) {
        try {
            const { userId, goodsId } = req.params
            const favorites = await FavoritesService.removeItemFromFavorites(
                userId,
                goodsId
            )
            return res.json(favorites)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }
}
