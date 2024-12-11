import { Router } from "express"
import CartController from "./controller.js"

const CartRouter = Router()

// CRUD для корзины
CartRouter.get("/api/cart/:userId", CartController.getCart)
CartRouter.post("/api/cart/:userId", CartController.addItem)
CartRouter.patch("/api/cart/:userId/:goodsId", CartController.updateItem)
CartRouter.delete("/api/cart/:userId/:goodsId", CartController.removeItem)

export default CartRouter
