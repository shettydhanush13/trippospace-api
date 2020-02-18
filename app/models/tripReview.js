
var mongoose = require("mongoose")
var schema = mongoose.Schema

var tripreviewsSchema = new schema({
    userId: String,
    tripId : String,
    tripTitle: String,
    thumb: String,
    date: String,
    days: Number,
    organizerName: String,
    organizerId: String,
    tripReview: Object
});

module.exports = mongoose.model('tripreviews', tripreviewsSchema)

