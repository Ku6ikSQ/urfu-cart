import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

const getMailOptions = (emailDest) => ({
    from: process.env.EMAIL,
    to: emailDest,
    subject: 'Hello World!',
    html: `
      <h1>Hello?</h1>
      <p>How are you?</p>
    `
})

export const sendMail = (email) => {
    return new Promise((resolve, reject) => {
      transporter.sendMail(getMailOptions(email), (error, info) => {
        if (error) {
          reject(error)
        }
        resolve(info)
      })
    })
  }