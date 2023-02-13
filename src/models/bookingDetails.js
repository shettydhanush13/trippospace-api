const mongoose = require("mongoose")
const schema = mongoose.Schema

const bookingDetailsSchema = new schema( {
    tripId : String,
    tripName : String,
    bookingId : String,
    user : Object,
    date : String,
    bookingDate : String,
    organizerId : String,
    transactionId : String,
    grossPrice : Number,
    price : Number,
    slots : Number,
    paid : Number,
    netPaid : Number,
    pending : Number,
    gift : Number,
    creditsReedeemed : Number,
    status : Array,
    cancelled : Number,
    refundPercentage : Number,
    refundAmount : Number,
    refundCredits : Number,
    refundData : Object,
    pendingAfterCancellation : Number,
    commission : Number,
    Payout : Number,
    isPayout : Boolean,
    isRefunded : Boolean,
    isSettled : Boolean,
    settlementData : Object,
    payoutData : Object
});

module.exports = mongoose.model('bookingDetails', bookingDetailsSchema)
