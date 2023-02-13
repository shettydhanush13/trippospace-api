const Settlements = require('../models/settlePending');
const OrganizerNotifications = require("../models/organizerNotifications")
const Booking = require("../models/bookingDetails")
const axios = require("axios")

const { getRazorpayHeaders } = require("../helpers/razorpay")
const { headers, baseUrl } = getRazorpayHeaders()

const { capturePayment } = require('./capturePayment')

const settlement = async () => {
    let toSettle = await Settlements.find({})
    logger.info(`pending payments to settle : ${toSettle.length}`) 
    for(let i=0; i<toSettle.length; i++) {
        await axios.get(`${baseUrl}/payment_links/${toSettle[i].id}`, headers )
        .then(async resp => {
            const { amount, amount_paid, id } = resp.data
            logger.info(`payment data to be settled : ${{ amount, amount_paid, id }}`) 
            if( amount === amount_paid ){
                await OrganizerNotifications.findOneAndUpdate({ "content.settleUpData.id" : id},{ $set : { settleUp : true }})
                await Booking.findOneAndUpdate({ "settlementData.id" : id },{ $set : { isSettled : true }})
                await Settlements.findOneAndDelete({ id })
            } else logger.info(`settlement id : ${id} for Rs.${amount/100} not settled yet`)
        }).catch(err => logger.error(`pending payment settlement error : ${err.response.data.error}`))
    } capturePayment();
}

module.exports = {
    settlement
};