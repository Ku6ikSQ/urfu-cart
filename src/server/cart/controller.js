import CartService from "./service.js"

export default class CartController {
    static async getCarts(req, res) {
        try {
            const { userId } = req.params
            const carts = await CartService.getCartsByUserId(userId)
            return res.json(carts)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async addItem(req, res) {
        try {
            const { cartId } = req.params
            const { goodsId, count, selected } = req.body
            const carts = await CartService.addItemToCart(
                cartId,
                goodsId,
                count,
                selected
            )
            return res.json(carts)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async updateItem(req, res) {
        try {
            const { cartId, goodsId } = req.params
            const { count, selected } = req.body
            const carts = await CartService.updateItemInCart(
                cartId,
                goodsId,
                count,
                selected
            )
            return res.json(carts)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async removeItem(req, res) {
        try {
            const { cartId, goodsId } = req.params
            const carts = await CartService.removeItemFromCart(cartId, goodsId)
            return res.json(carts)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }

    static async getCartById(req, res) {
        try {
            const cartId = req.params.cartId
            const cart = await CartService.getCartById(cartId)
            res.status(200).json(cart)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    static async createCart(req, res) {
        try {
            const userId = req.body.userId
            const newCart = await CartService.createCart(userId)
            res.status(201).json(newCart)
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    }
}
