var mongoose = require("mongoose")
var schema = mongoose.Schema

var upcomingTripsSchema = new schema({
    transactionId:String,
    bookingId:String,
    thumb:String,
    tripId:String,
    tripTitle:String,
    travelers:Number,
    credits:Number,
    date:String,
    days:Number,
    userId:String,
    travelers : Number,
    price : String,
    paid : String,
    pending : String,
    organizerId : String,
    whatsappLink : String
});

module.exports = mongoose.model('upcomingtrips', upcomingTripsSchema)