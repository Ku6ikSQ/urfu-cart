import { Router } from "express"
import FavoritesController from "./controller.js"

const FavoritesRouter = Router()

// CRUD для избранных товаров
FavoritesRouter.get("/api/favorites/:userId", FavoritesController.getFavorites)
FavoritesRouter.post("/api/favorites/:userId", FavoritesController.addItem)
FavoritesRouter.delete(
    "/api/favorites/:userId/:goodsId",
    FavoritesController.removeItem
)

export default FavoritesRouter
