const Booking = require('../models/bookingDetails');
const CancellationRequest = require('../models/cancellationRequest')
const Users = require('../models/users');
const log4js = require('log4js');
const logger = log4js.getLogger("organizers"); 
const axios = require("axios")
const { organizerPayouts }  = require("./organizerPayouts")

const { getRazorpayHeaders } = require("../helpers/razorpay")
const { headers, baseUrl } = getRazorpayHeaders()

const refund = async ({refundAmount, _id, transactionId, bookingId , refundCredits, user }) => {
    let body = {
        "amount": refundAmount*100,
        "speed": "normal",
        "receipt": `Receipt No. ${_id}`
    }   
    logger.info(`refund data : ${JSON.stringify(body)}`)    
    await axios.post(`${baseUrl}/payments/${transactionId}/refund`, body, headers)
    .then(async (res) => {
        const updateBody = {
            refunded : true,
            refundId : res.data.id,
            refundDate : new Date(res.data.created_at)
        }
        const refundData = {
            amount : refundAmount,
            id : res.data.id,
            date : new Date(res.data.created_at)
        }
        logger.info(`refund successful for booking id ${bookingId} of Rs.${refundAmount}. refund id = ${res.data.id}`);
        await CancellationRequest.updateOne({ transactionId }, { $set : updateBody });
        await Booking.findOneAndUpdate({ _id }, { $set : { isRefunded : true, refundData } });
        await Users.findOneAndUpdate({ _id : user.id }, { $inc : {'stats.credits' : refundCredits }})
    }).catch((err) => {
        logger.error(`refund failed for booking id ${bookingId} => ${err.response.data.error.description}`)
    })
}

const refundRequest = async () => {
    logger.info(`Cron job function settling refund requests`);
    Booking.find({ isRefunded : false, cancelled : { $gt : 0 } }, async (err, requests) => {
        if(err) console.log(err)
        else {
            logger.info(`pending payments to refund : ${requests.length}`) 
            for( let i = 0; i < requests.length; i++ ) await refund(requests[i])
            organizerPayouts();
        }
    })
}

module.exports = { refundRequest };
