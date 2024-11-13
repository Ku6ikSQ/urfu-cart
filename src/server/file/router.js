import { Router } from "express"
import FileController from "./controller.js"

const FileRouter = Router()

// Маршруты для работы с файлами
FileRouter.post("/api/file/upload", FileController.uploadFile)
FileRouter.get("/api/file/:fileName", FileController.getFile)
FileRouter.delete("/api/file/:fileName", FileController.deleteFile)

export default FileRouter
