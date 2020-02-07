
var mongoose = require("mongoose")
var schema = mongoose.Schema

var completedTripsSchema = new schema({
    organizerName:String,
    organizerId:String,
    stats:Object,
    trips:Object
});

module.exports = mongoose.model('completedTrips', completedTripsSchema)