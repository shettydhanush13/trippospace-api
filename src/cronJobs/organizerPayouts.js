const Bookings = require('../models/organizerNotifications');
const Organizer = require('../models/organizers');
const Payouts = require("../models/payouts")

const { config } = require("../config")

const calculatePayout = (price, paid, organizerId) => {
    let commission = Math.floor(price/config.organizerCommissions[organizerId])
    let payout = paid - commission
    return payout < 0 ? 0 : payout
}

const Total =  (data, type) => {
    let total = 0
    for(let i=0; i<data.length; i++) total+=data[i][type]
    return total
}

const processPayments = async (organizersToPay, Paydata) => {
    for(let i = 0; i< organizersToPay.length; i++) {
        let organizerToPay = organizersToPay[i]
        await Organizer.findOne({_id : organizerToPay}, (err, organizer) => {
            if(err) console.log(err)
            else {
                let payouts = new Payouts();
                payouts.name = organizer.name
                payouts.id = organizer._id
                payouts.date = new Date().toISOString().split("T")[0]
                payouts.mail = organizer.contact.mail
                payouts.accountId = organizer.accountId
                payouts.travelers = Total(Paydata[organizer._id], "Travelers")
                payouts.price = Total(Paydata[organizer._id], "Gross Revenue")
                payouts.pending = Total(Paydata[organizer._id],"To be collected from customer")
                payouts.commission = Total(Paydata[organizer._id], "Booking handling charges + GST")
                payouts.toBePaid = Total(Paydata[organizer._id], "Pending from Trippospace")
                payouts.settled = false
                payouts.save(async (err, response) => {
                    if(err) console.log(err)
                    else {
                        await Bookings.updateMany({organizerId : organizerToPay}, { $set : { "content.payout" : true }}, (err, organizer) => {
                            if(err) console.log(err)
                            else console.log(organizer)
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
    for(let i = 0; i< bookings.length; i++) {
        let booking = bookings[i]
        list.push(bookings[i].organizerId)
        const { bookingId, price, paid, pending, quantity } = booking.content
        paymentDetails.push({
            organizerId : booking.organizerId,
            "Booking date" : booking.timestamp,
            "Booking ID" : bookingId,
            "Travelers" : quantity,
            "Gross Revenue" : price,
            "To be collected from customer" : pending,
            "Booking handling charges + GST" : Math.floor(price/config.organizerCommissions[booking.organizerId]),
            "Pending from Trippospace" : calculatePayout(price,paid,booking.organizerId)
        })
    }
    let organizersToPay = Array.from(new Set(list));
    let payouts = {}
    for(let i = 0; i< organizersToPay.length; i++){
        let organizerToPay = organizersToPay[i]
        payouts[organizerToPay] = paymentDetails.filter((e) => e.organizerId === organizerToPay)
    }
    return {organizersToPay,payouts}
}

const organizerPayouts = async () => {
    Bookings.find({ "content.payout" : false }, async (err, bookings) => {
        if(err) console.log(err)
        else {
            let {organizersToPay,payouts} = await formatBookings(bookings)
            processPayments(organizersToPay, payouts)
        }
    })
}

module.exports = {
    organizerPayouts,
    formatBookings
};
