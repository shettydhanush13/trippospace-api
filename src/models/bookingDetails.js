const mongoose = require("mongoose")
const schema = mongoose.Schema

const bookingDetailsSchema = new schema( {
    tripId : String,
    bookingId : String,
    user : Object,
    date : String,
    organizerId : String,
    transactionId : String,
    price : String,
    slots : String,
    paid : String,
    gift : String,
    creditsReedeemed : String,
    status : Array,
    cancelled : Number,
    refunded : Number
});

module.exports = mongoose.model('bookingDetails', bookingDetailsSchema)
