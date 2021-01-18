const CancellationRequest = require('../models/cancellationRequest');
const log4js = require('log4js');
const logger = log4js.getLogger("organizers"); 
const axios = require("axios")
const { config } = require("../config");
const { id, secret, baseUrl } = config.razorPayConfig

const basicAuth = 'Basic ' + Buffer.from(`${id}:${secret}`, 'binary').toString('base64')

const refund = async ({refund, ticketId, transactionId, bookingId }) => {
    let body = {
        "amount": refund,
        "speed": "normal",
        "receipt": `Receipt No. ${ticketId}`
      }
      
    await axios.post(`${baseUrl}/${transactionId}/refund`, body, { headers : { Authorization: basicAuth } })
    .then((res) => {
        updateBody = {
            refunded : true,
            refundId : res.data.id,
            refundDate : new Date(res.data.created_at)
        }
        logger.info(`refund successful for booking id ${bookingId} of Rs.${refund}. refund id = ${res.data.id}`);
        await CancellationRequest.updateOne({ ticketId }, { $set : updateBody });
    }).catch((err) => {
        logger.error(`refund failed for booking id ${bookingId} => ${err.response.data.error.description}`);
    })
}

const refundRequest = async () => {
    CancellationRequest.find({ refunded : false }, async (err, requests) => {
        if(err) console.log(err)
        else for(let i=0; i<requests.length; i++) await refund(requests[i])
    })
}

module.exports = { refundRequest };
