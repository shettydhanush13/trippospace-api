
var mongoose = require("mongoose")
var schema = mongoose.Schema

var tripreviewsSchema = new schema({
    name:String,
    id:String,
    tripDate:String,
    rating:Number,
    review: String,
    images:Array
});

module.exports = mongoose.model('tripreviews', tripreviewsSchema)

