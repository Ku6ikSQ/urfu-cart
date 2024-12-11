import db from "../db/db.js"

export default class CartService {
    static async getCartByUserId(userId) {
        const cartResult = await db.query(
            "SELECT * FROM Cart WHERE user_id = $1",
            [userId]
        )
        const cart = cartResult.rows[0]

        if (!cart) {
            return { user_id: userId, items: [] }
        }

        const itemsResult = await db.query(
            "SELECT * FROM CartItems WHERE cart_id = $1",
            [cart.id]
        )
        return { user_id: userId, items: itemsResult.rows }
    }

    static async addItemToCart(userId, goodsId, count, selected) {
        let cart = await db.query("SELECT * FROM Cart WHERE user_id = $1", [
            userId,
        ])
        if (cart.rows.length === 0) {
            const newCart = await db.query(
                "INSERT INTO Cart (user_id) VALUES ($1) RETURNING *",
                [userId]
            )
            cart = newCart.rows[0]
        } else {
            cart = cart.rows[0]
        }

        const existingItemIndex = await db.query(
            "SELECT * FROM CartItems WHERE cart_id = $1 AND goods_id = $2",
            [cart.id, goodsId]
        )
        if (existingItemIndex.rows.length > 0) {
            const item = existingItemIndex.rows[0]
            await db.query(
                "UPDATE CartItems SET count = $1, selected = $2 WHERE id = $3",
                [item.count + count, selected, item.id]
            )
        } else {
            await db.query(
                "INSERT INTO CartItems (cart_id, goods_id, count, selected) VALUES ($1, $2, $3, $4)",
                [cart.id, goodsId, count, selected]
            )
        }

        return this.getCartByUserId(userId)
    }

    static async updateItemInCart(userId, goodsId, count, selected) {
        const cart = await db.query("SELECT * FROM Cart WHERE user_id = $1", [
            userId,
        ])
        if (cart.rows.length === 0) throw new Error("Cart not found")

        const item = await db.query(
            "SELECT * FROM CartItems WHERE cart_id = $1 AND goods_id = $2",
            [cart.rows[0].id, goodsId]
        )
        if (item.rows.length === 0) throw new Error("Item not found in cart")

        await db.query(
            "UPDATE CartItems SET count = $1, selected = $2 WHERE id = $3",
            [count, selected, item.rows[0].id]
        )
        return this.getCartByUserId(userId)
    }

    static async removeItemFromCart(userId, goodsId) {
        const cart = await db.query("SELECT * FROM Cart WHERE user_id = $1", [
            userId,
        ])
        if (cart.rows.length === 0) throw new Error("Cart not found")

        await db.query(
            "DELETE FROM CartItems WHERE cart_id = $1 AND goods_id = $2",
            [cart.rows[0].id, goodsId]
        )
        return this.getCartByUserId(userId)
    }
}
