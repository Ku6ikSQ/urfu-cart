import CartService from "./service.js"

export default class CartController {
    static async getCart(req, res) {
        try {
            const { userId } = req.params
            const cart = await CartService.getCartByUserId(userId)
            return res.json(cart)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async addItem(req, res) {
        try {
            const { userId } = req.params
            const { goodsId, count, selected } = req.body
            const cart = await CartService.addItemToCart(
                userId,
                goodsId,
                count,
                selected
            )
            return res.json(cart)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async updateItem(req, res) {
        try {
            const { userId, goodsId } = req.params
            const { count, selected } = req.body
            const cart = await CartService.updateItemInCart(
                userId,
                goodsId,
                count,
                selected
            )
            return res.json(cart)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async removeItem(req, res) {
        try {
            const { userId, goodsId } = req.params
            const cart = await CartService.removeItemFromCart(userId, goodsId)
            return res.json(cart)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }
}
