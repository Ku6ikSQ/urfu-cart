import { Router } from "express"
import CartController from "./controller.js"

const CartRouter = Router()

CartRouter.get("/api/cart/user/:userId", CartController.getCarts)
CartRouter.get("/api/cart/:cartId", CartController.getCartById)
CartRouter.post("/api/cart", CartController.createCart)
CartRouter.patch("/api/cart/:cartId/:goodsId", CartController.updateItem)
CartRouter.delete("/api/cart/:cartId/:goodsId", CartController.removeItem)
CartRouter.post("/api/cart/:cartId/items", CartController.addItem)

export default CartRouter
