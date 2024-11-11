import express from "express"
import fileUpload from "express-fileupload"
import dotenv from 'dotenv'
import https from 'https'
import fs from 'fs'
import cors from 'cors'
import AuthRouter from './auth/router.js'
import GoodCategoryRouter from "./goods-categories/router.js"
import GoodsRouter from "./goods/router.js"
import FileRouter from "./file/router.js"

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()
export const serverURL = `${process.env.SERVER_URL}:${PORT}`

app.use(cors())
app.use(fileUpload({}))
app.use(express.json())
app.use(AuthRouter);
app.use(GoodCategoryRouter)
app.use(GoodsRouter)
app.use(FileRouter)

//TODO: скопируй содержимое из сервера
if(process.env.VPS) {
    const sslOptions = {
        key: fs.readFileSync('/path/to/certs/privkey.pem'),
        cert: fs.readFileSync('/path/to/certs/fullchain.pem')
      }
    https.createServer(sslOptions, app).listen(PORT, () => {
        console.log('Server has been started')
      })
} else {
    app.listen(PORT, () => {
        console.log('Server has been started')
    })
}
