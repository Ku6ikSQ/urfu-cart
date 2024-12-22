import { Router } from "express"
import NewsController from "./controller.js"

const NewsRouter = Router()

// CRUD для новостей
NewsRouter.get("/api/news/:id", NewsController.getNewsById)
NewsRouter.get("/api/news", NewsController.getAllNews)
NewsRouter.post("/api/news", NewsController.createNews)
NewsRouter.patch("/api/news/:id", NewsController.updateNews)
NewsRouter.delete("/api/news/:id", NewsController.deleteNews)

export default NewsRouter
