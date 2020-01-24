
var mongoose = require("mongoose")
var schema = mongoose.Schema

var reviewsSchema = new schema({
    name:String,
    id:String,
    trip:String,
    tripDate:String,
    date:String,
    title:String,
    rating:Number,
    review: String
});

module.exports = mongoose.model('reviews', reviewsSchema)