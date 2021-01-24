const Bookings = require('../models/organizerNotifications');
const Organizer = require('../models/organizers');
const jsonexport = require("jsonexport");
const fs = require("fs");
const sgMail = require('@sendgrid/mail');
const { config } = require("../config")

const { apiKey } = config.sendGrid

const { formatBookings } = require("./organizerPayouts")

const sendMail = async (organizersToPay, today) => {
    for(let i=0; i< organizersToPay.length; i++){
        let organizerToPay = organizersToPay[i]
        await Organizer.findOne({_id : organizerToPay}, (err, organizer) => {
            if(err) console.log(err)
            else {
                sgMail.setApiKey(apiKey);    
                const fs = require("fs");            
                const msg = {
                    to: organizer.contact.mail,
                    from: 'important@trippospace.com',
                    subject: `IMPORTANT : TRIPPOSPACE DAILY REPORT (${today})`,
                    text: `Daily trips booking information report for ${today}`,
                    attachments: [
                        {
                            content: fs.readFileSync(`./src/static/${organizer._id}.csv`).toString("base64"),
                            filename: `report-${today}.csv`,
                            type: "application/csv",
                            disposition: "attachment"
                        }
                    ]
                };
                sgMail.send(msg).then(res => fs.unlinkSync(`./src/static/${organizer._id}.csv`)).catch(err => console.log(err));
            }
        })
    }
}

const organizerDailyReports = async () => {
    const today = new Date().toISOString().split("T")[0]
    Bookings.find({ timestamp : today }, async (err, bookings) => {
        if(err) console.log(err)
        else {
            let {organizersToPay, payouts} = await formatBookings(bookings)
            console.log(organizersToPay,payouts)
            for(let i=0; i< organizersToPay.length; i++) {
                let organizerToPay = organizersToPay[i]
                jsonexport(payouts[organizerToPay], async (err, csv) => {
                    fs.writeFileSync(`./src/static/${organizerToPay}.csv`,csv);
                });
            } sendMail(organizersToPay, today)
        }
    })
}

module.exports = {
    organizerDailyReports
};
