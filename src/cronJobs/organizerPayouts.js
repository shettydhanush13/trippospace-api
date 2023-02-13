const log4js = require('log4js');
const logger = log4js.getLogger("organizers"); 
const Bookings = require('../models/bookingDetails');
const Organizer = require('../models/organizers');
const Notification = require('../models/organizerNotifications')
const Payouts = require("../models/payouts")

const Total = (data, type) => {
    let total = 0
    for(let i=0; i < data.length; i++) total+=data[i][type]
    return total
}

const processPayments = async (organizersToPay, Paydata, bookings) => {
    let bookingIds = []
    for(let i = 0; i< bookings.length; i++) bookingIds.push(bookings[i].bookingId)
    for(let i = 0; i< organizersToPay.length; i++) {
        const organizerToPay = organizersToPay[i]
        await Organizer.findOne({_id : organizerToPay}, (err, organizer) => {
            if(err) logger.error(err)
            else {
                const payouts = new Payouts();
                payouts.name = organizer.name
                payouts.id = organizer._id
                payouts.bookingIds = bookingIds
                payouts.date = new Date().toISOString().split("T")[0]
                payouts.mail = organizer.contact.mail
                payouts.accountId = organizer.accountId
                payouts.travelers = Total(Paydata[organizer._id], "Travelers")
                payouts.price = Total(Paydata[organizer._id], "Gross Revenue")
                payouts.pending = Total(Paydata[organizer._id],"To be collected from customer")
                payouts.commission = Total(Paydata[organizer._id], "Booking handling charges + GST")
                payouts.toBePaid = Total(Paydata[organizer._id], "Pending from Trippospace")
                payouts.settled = false
                payouts.save(async (err) => {
                    if(err) logger.error(err)
                    else {
                        const query = { organizerId : organizerToPay }
                        await Bookings.updateMany(query, { $set : { isPayout : true }})
                        await Notification.updateMany(query, { $set : { "content.payout" : true }}, err => {
                            if(err) logger.error(err)
                            else logger.info(`payout data of ${organizer.name} updated for booking Ids : ${JSON.stringify(bookingIds)}`)
                        })
                    }
                });
            }
        })
    }
}

const formatBookings = async (bookings) => {
    let list = []
    let paymentDetails = []
    for(i in bookings) {
        let booking = bookings[i]
        list.push(booking.organizerId)
        const { 
            organizerId,
            bookingDate,
            bookingId,
            slots,
            cancelled,
            grossPrice,
            pending,
            pendingAfterCancellation,
            refundCredits,
            refundAmount,
            commission,
            Payout
        } = booking
        paymentDetails.push({
            "organizerId" : organizerId,
            "Booking date" : bookingDate,
            "Booking ID" : bookingId,
            "Travelers" : slots-cancelled,
            "Gross Revenue" : cancelled > 0 ? grossPrice-(pending-pendingAfterCancellation)-refundAmount-refundCredits : grossPrice,
            "To be collected from customer" : cancelled > 0 ? pendingAfterCancellation : pending,
            "Booking handling charges + GST" : commission,
            "Pending from Trippospace" : Payout
        })
    }

    const organizersToPay = Array.from(new Set(list));
    let payouts = {}
    for(let i = 0; i< organizersToPay.length; i++){
        const organizerToPay = organizersToPay[i]
        payouts[organizerToPay] = paymentDetails.filter((e) => e.organizerId === organizerToPay)
    }
    return { organizersToPay, payouts }
}

const organizerPayouts = async () => {
    logger.info(`Cron job function creating organizer payouts`);
    await Bookings.find({ isPayout : false }, async (err, bookings) => {
        if(err) logger.error(err)
        else {
            const { organizersToPay, payouts } = await formatBookings(bookings)
            logger.info(`payouts data : ${JSON.stringify(payouts)}`) 
            processPayments(organizersToPay, payouts, bookings)
        }
    })
}

module.exports = {
    organizerPayouts,
    formatBookings
};
