var mongoose = require("mongoose")
var schema = mongoose.Schema

var cancellationRequestSchema = new schema( {
    tripId : String,
    bookingId : String,
    userId : String,
    organizerId : String,
    transactionId : String,
    date : String,
    slots : String,
    slotsToCancel : String,
    amountPaid : String
});

module.exports = mongoose.model('cancellationRequest', cancellationRequestSchema)
