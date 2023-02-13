const { baseTemplate } = require("./baseTemplate")
const sgMail = require('@sendgrid/mail');
const { config } = require("../config")
const { apiKey } = config.sendGrid
sgMail.setApiKey(apiKey);

module.exports = {
  ForgotPassword : (req, Users, Organizer) => {
    const { forgotPassword } = require("./forgotPassword")
    return new Promise((resolve, reject) => {
      let { platform, mail } = req.body
      DB = (platform === "user") ? Users : Organizer
      DB.findOne(platform === "user" ? { email : mail } : { "contact.mail" : mail }, (err, user) => {
        if(err) console.log(err)
        else if (user !== null) {
              let code = platform + user._id + user.password
              let buffer = new Buffer.from(code);
              let resetCode = buffer.toString('base64');
              let html = forgotPassword(resetCode)
              const msg = {
                to: mail,
                from: 'passwords@trippospace.com',
                subject: 'LINK TO RESET YOUR PASSWORD',
                html: baseTemplate(html)
              };
              sgMail.send(msg).catch(err => console.log(err))
              resolve({ message : "Reset link sent" })
          } else resolve({ error: "Use registered email" })
      })
    });
  },

  BookNotification : req => {
    const { bookNotification } = require("./bookingNotification")
    return new Promise((resolve, reject) => {
      const { customer, title } = req.body
      const html = bookNotification(req.body)
      const msg = {
          to: customer.email,
          bcc: "trippospace@gmail.com",
          from: 'bookings@trippospace.com',
          subject: `BOOKING CONFORMATION FOR ${title.toUpperCase()}`,
          html: baseTemplate(html)
        }
        sgMail.send(msg).catch(err => console.log(err))
        resolve({ message : "Confirmation mail sent" })     
      });
  },

  Welcome : req => {
    const { welcome } = require("./welcome")
      return new Promise((resolve, reject) => {
        const { mail } = req.body
        const html = welcome(req.body)
        const msg = {
            to: mail,
            bcc: "trippospace@gmail.com",
            from: 'welcome@trippospace.com',
            subject: `WELCOME TO TRIPPOSPACE`,
            html: baseTemplate(html)
        };
        sgMail.send(msg).catch(err => console.log(err))
        resolve({ message : "welcome" })
      });
  },

  Quote : req => {
    const { quote } = require("./quote")
    return new Promise((resolve, reject) => {
    const { email } = req
    const html = quote(req)
    const msg = {
        to: email,
        bcc: "trippospace@gmail.com",
        from: 'info@trippospace.com',
        subject: `TRIPPOSPACE QUOTE RECEIVED`,
        html: baseTemplate(html)
      };
      sgMail.send(msg).catch(err => console.log(err))
      resolve({ message : "welcome" })
    });
  }
} 