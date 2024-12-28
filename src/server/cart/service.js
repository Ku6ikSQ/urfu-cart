import db from "../db/db.js"

export default class CartService {
    static async getCartsByUserId(userId) {
        const cartsResult = await db.query(
            "SELECT * FROM Cart WHERE user_id = $1",
            [userId]
        )
        const carts = cartsResult.rows
        const itemsPromises = carts.map((cart) =>
            db.query("SELECT * FROM CartItems WHERE cart_id = $1", [cart.id])
        )
        const itemsResults = await Promise.all(itemsPromises)

        return carts.map((cart, index) => ({
            cart_id: cart.id,
            user_id: userId,
            main: cart.main,
            items: itemsResults[index].rows,
        }))
    }

    static async addItemToCart(cartId, goodsId, count, selected) {
        const existingItemIndex = await db.query(
            "SELECT * FROM CartItems WHERE cart_id = $1 AND goods_id = $2",
            [cartId, goodsId]
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
                [cartId, goodsId, count, selected]
            )
        }
        return this.getCartById(cartId)
    }

    static async updateItemInCart(cartId, goodsId, count, selected) {
        const item = await db.query(
            "SELECT * FROM CartItems WHERE cart_id = $1 AND goods_id = $2",
            [cartId, goodsId]
        )
        if (item.rows.length === 0) throw new Error("Item not found in cart")

        await db.query(
            "UPDATE CartItems SET count = $1, selected = $2 WHERE id = $3",
            [count, selected, item.rows[0].id]
        )
        return this.getCartById(cartId)
    }

    static async removeItemFromCart(cartId, goodsId) {
        await db.query(
            "DELETE FROM CartItems WHERE cart_id = $1 AND goods_id = $2",
            [cartId, goodsId]
        )
        return this.getCartById(cartId)
    }

    static async getCartById(cartId) {
        const cartResult = await db.query("SELECT * FROM Cart WHERE id = $1", [
            cartId,
        ])

        if (cartResult.rows.length === 0) throw new Error("Cart not found")

        const cart = cartResult.rows[0]
        const itemsResult = await db.query(
            "SELECT * FROM CartItems WHERE cart_id = $1",
            [cart.id]
        )

        return {
            cart_id: cart.id,
            user_id: cart.user_id,
            main: cart.main,
            items: itemsResult.rows,
        }
    }

    static async createCart(userId) {
        const result = await db.query(
            "INSERT INTO Cart (user_id, main) VALUES ($1, $2) RETURNING id",
            [userId, false]
        )
        return this.getCartById(result.rows[0].id)
    }
}
