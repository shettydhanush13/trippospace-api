
const mongoose = require("mongoose")
const schema = mongoose.Schema

const tripreviewsSchema = new schema({
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
    date:String,
    bookingId : String
});

module.exports = mongoose.model('tripreviews', tripreviewsSchema)

