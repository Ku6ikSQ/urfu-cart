import express from "express"
import fileUpload from "express-fileupload"
import AuthRouter from './auth/router.js'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()
export const serverURL = `http://localhost:${PORT}`

app.use(fileUpload({}))
app.use(express.json())
app.use(express.static('static'))
app.use(AuthRouter)
app.listen(PORT, () => {
    console.log('Server has been started')
})