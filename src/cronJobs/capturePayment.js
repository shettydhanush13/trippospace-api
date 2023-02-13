const log4js = require('log4js');
const logger = log4js.getLogger("organizers"); 
const axios = require("axios")
const { refundRequest } = require('./refunds')
const { getRazorpayHeaders } = require("../helpers/razorpay")
const { headers, baseUrl } = getRazorpayHeaders()

const capturePayment = async () => {  
    logger.log(`Cron job function for capturing payments of the day`);  
    await axios.get(`${baseUrl}/payments`, headers)
    .then(async (res) => {
        const toCapture = res.data.items.filter(e => e.status === 'authorized')
        logger.log(`pending payments to capture : ${toCapture.length}`) 
        for(let i=0; i < toCapture.length; i++) {
            const id = toCapture[i].id
            const amount = toCapture[i].amount
            const body = {
                amount,
                currency : "INR"
            }
            console.log(`pending payment to capture : ${JSON.stringify({id, amount})}`) 
            await axios.post(`${baseUrl}/payments/${id}/capture`, body, headers)
            .then(() => logger.info(`paymet captured for ${id}`))
            .catch((err) => logger.error(`paymet capture failed for ${id} : ${err}`))
        } refundRequest()
    }).catch((err) => {
        refundRequest()
        logger.error(`paymet fetching failed : ${err}`)
    })
}

module.exports = { capturePayment };
