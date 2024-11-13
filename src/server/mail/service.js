import nodemailer from "nodemailer"

const getMailOptions = (emailDest, text) => ({
    from: process.env.EMAIL,
    to: emailDest,
    subject: "urfu-cart confirmation",
    text,
})

export const sendMail = (email, content) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    })

    return new Promise((resolve, reject) => {
        const options = getMailOptions(email, content)
        transporter.sendMail(options, (error, info) => {
            if (error) {
                reject(error)
            }
            resolve(info)
        })
    })
}
