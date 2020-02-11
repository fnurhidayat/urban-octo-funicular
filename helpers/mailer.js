const nodemailer = require('nodemailer')
const sgTransport = require('nodemailer-sendgrid-transport')

const {
  SENDGRID_API_KEY
} = process.env

const option = {
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}

const client = nodemailer.createTransport(sgTransport(option))

module.exports = {
  create: ({ to, subject, html }) => {
    return {
      from: 'no-reply@express.com',
      to,
      subject,
      html
    }
  },

  send: data => {
    return client.sendMail(data)
  }
}
