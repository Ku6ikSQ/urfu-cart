import { Router } from "express"
import GoodCategoryController from "./controller.js"

const GoodCategoryRouter = Router()

// CRUD
GoodCategoryRouter.get(
    "/api/good-categories/:id",
    GoodCategoryController.getCategoryById
)
GoodCategoryRouter.get(
    "/api/good-categories",
    GoodCategoryController.getAllCategories
)
GoodCategoryRouter.post(
    "/api/good-categories",
    GoodCategoryController.createCategory
)
GoodCategoryRouter.patch(
    "/api/good-categories/:id",
    GoodCategoryController.updateCategory
)
GoodCategoryRouter.delete(
    "/api/good-categories/:id",
    GoodCategoryController.deleteCategory
)

export default GoodCategoryRouter
