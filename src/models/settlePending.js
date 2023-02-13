const mongoose = require("mongoose")
const schema = mongoose.Schema

const settlePendingSchema = new schema( {
    tripId : String,
    notificationId : String,
    bookingId : String,
    tripName : String,
    user : Object,
    organizerId : String,
    id: String,
    reference_id: String,
    short_url: String,
    description: String,
    price : String,
    paid : String,
    pending : String,
});

module.exports = mongoose.model('settlePending', settlePendingSchema)
