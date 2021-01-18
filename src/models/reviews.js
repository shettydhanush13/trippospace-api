
const mongoose = require("mongoose")
const schema = mongoose.Schema

const reviewsSchema = new schema({
    name:String,
    id:String,
    trip:String,
    tripDate:String,
    rating:Number,
    review: String,
    organizer:String,
    bookingId : String
});

module.exports = mongoose.model('reviews', reviewsSchema)