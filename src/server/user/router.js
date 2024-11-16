import { Router } from "express"
import UserController from "./controller.js"

const UserRouter = Router()

// CRUD operations for users
UserRouter.get("/api/users/:id", UserController.getUserById)
UserRouter.get("/api/users", UserController.getAllUsers)
UserRouter.post("/api/users", UserController.createUser)
UserRouter.patch("/api/users/:id", UserController.updateUser)
UserRouter.delete("/api/users/:id", UserController.deleteUser)

export default UserRouter
