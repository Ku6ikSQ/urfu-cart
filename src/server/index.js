import express from "express"
import fileUpload from "express-fileupload"
import dotenv from 'dotenv'
import AuthRouter from './auth/router.js'
import GoodCategoryRouter from "./goods-categories/router.js"
import GoodsRouter from "./goods/router.js"
import FileRouter from "./file/router.js"

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()
export const serverURL = `http://localhost:${PORT}`

app.use(fileUpload({}))
app.use(express.json())
app.use(AuthRouter)
app.use(GoodCategoryRouter)
app.use(GoodsRouter)
app.use(FileRouter)
  
app.listen(PORT, () => {
    console.log('Server has been started')
})