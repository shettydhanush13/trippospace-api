var mongoose = require("mongoose")
var schema = mongoose.Schema

var myTripsSchema = new schema({  
    name : String,
    title : String,
    views: Number,
    latitude:Number,
    longitude: Number,
    images: Array,
    blog : String,
    userId: String
});

module.exports = mongoose.model('myTrips', myTripsSchema)