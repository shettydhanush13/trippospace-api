const mongoose = require("mongoose")
const schema = mongoose.Schema

const cancellationRequestSchema = new schema( {
    ticketId : String,
    tripId : String,
    bookingId : String,
    user : Object,
    organizerId : String,
    transactionId : String,
    booked : String,
    tripDate : String,
    cancelDate : String,
    refundDate : String,
    cancelled : String,
    price : String,
    paid  : String,
    pending : String,
    creditsRedeemed : String,
    refundPercentage : String,
    refund : String,
    refundId : String,
    refunded : Boolean,
});

module.exports = mongoose.model('cancellationRequest', cancellationRequestSchema)
