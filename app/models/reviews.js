
var mongoose = require("mongoose")
var schema = mongoose.Schema

var reviewsSchema = new schema({
    name:String,
    id:String,
    trip:String,
    tripDate:String,
    rating:Number,
    review: String,
    organizer:String
});

module.exports = mongoose.model('reviews', reviewsSchema)