var mongoose = require("mongoose")
var schema = mongoose.Schema

var upcomingTripsSchema = new schema({
    thumb:String,
    tripId:String,
    tripTitle:String,
    travelers:Number,
    credits:Number,
    date:String,
    days:Number,
    userId:String,
    travelers : Number,
    price : Number
});

module.exports = mongoose.model('upcomingtrips', upcomingTripsSchema)