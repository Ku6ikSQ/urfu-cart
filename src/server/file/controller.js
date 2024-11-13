import FileService from "./service.js"

export default class FileController {
    static async uploadFile(req, res) {
        try {
            const file = req.files?.file
            if (!file) return res.status(400).json("No file uploaded")
            const fileName = await FileService.uploadFile(file)
            return res.status(200).json(fileName)
        } catch (e) {
            return res.status(500).json(e.message)
        }
    }

    static async getFile(req, res) {
        try {
            const { fileName } = req.params
            const presignedUrl = await FileService.getFile(fileName)
            return res.status(200).json(presignedUrl)
        } catch (e) {
            return res.status(500).json(e.message)
        }
    }

    static async deleteFile(req, res) {
        try {
            const { fileName } = req.params
            await FileService.deleteFile(fileName)
            return res.status(200).json("File successfully deleted")
        } catch (e) {
            return res.status(500).json(e.message)
        }
    }
}
