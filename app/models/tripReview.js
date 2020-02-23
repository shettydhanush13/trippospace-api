
var mongoose = require("mongoose")
var schema = mongoose.Schema

var tripreviewsSchema = new schema({
    name:String,
    id:String,
    thumb: String,
    tripDate:String,
    rating:Number,
    review: String,
    images:Array,
    organizerName: String,
    organizerId: String,
    tripTitle: String,
    days:Number,
    date:String
});

module.exports = mongoose.model('tripreviews', tripreviewsSchema)

