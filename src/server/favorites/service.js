import db from "../db/db.js"

export default class FavoritesService {
    static async getFavoritesByUserId(userId) {
        const favoritesResult = await db.query(
            "SELECT * FROM Favorites WHERE user_id = $1",
            [userId]
        )
        const favorites = favoritesResult.rows[0]

        if (!favorites) {
            return { user_id: userId, items: [] }
        }

        const itemsResult = await db.query(
            "SELECT * FROM FavoriteItems WHERE favorites_id = $1",
            [favorites.id]
        )
        return { user_id: userId, items: itemsResult.rows }
    }

    static async addItemToFavorites(userId, goodsId) {
        let favorites = await db.query(
            "SELECT * FROM Favorites WHERE user_id = $1",
            [userId]
        )
        if (favorites.rows.length === 0) {
            const newFavorites = await db.query(
                "INSERT INTO Favorites (user_id) VALUES ($1) RETURNING *",
                [userId]
            )
            favorites = newFavorites.rows[0]
        } else {
            favorites = favorites.rows[0]
        }

        const existingItemIndex = await db.query(
            "SELECT * FROM FavoriteItems WHERE favorites_id = $1 AND goods_id = $2",
            [favorites.id, goodsId]
        )
        if (existingItemIndex.rows.length === 0) {
            await db.query(
                "INSERT INTO FavoriteItems (favorites_id, goods_id) VALUES ($1, $2)",
                [favorites.id, goodsId]
            )
        }

        return this.getFavoritesByUserId(userId)
    }

    static async removeItemFromFavorites(userId, goodsId) {
        const favorites = await db.query(
            "SELECT * FROM Favorites WHERE user_id = $1",
            [userId]
        )
        if (favorites.rows.length === 0) throw new Error("Favorites not found")

        await db.query(
            "DELETE FROM FavoriteItems WHERE favorites_id = $1 AND goods_id = $2",
            [favorites.rows[0].id, goodsId]
        )
        return this.getFavoritesByUserId(userId)
    }
}
