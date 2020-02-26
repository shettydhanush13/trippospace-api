var mongoose = require("mongoose")
var schema = mongoose.Schema

var tripsSchema = new schema({
    title: String,
    destination: String,
    thumb: String,
    description: {
        short: String,
        detailed: String
    },
    images: Array,
    reviews: Array,
    tags: Array,
    isFav: Boolean,
    isActive: Boolean,
    place: Array,
    organizerId: String,
    organizerName: String,
    booking: {
        slots: Number,
        customerList: Array,
        days: Number,
        date: String,
        allDates: Array,
        departureCity: String,
        priceBefore: Number,
        priceAfter: Number
    },
    itinerary: Array,
    pickup: Array,
    inclusions: Array,
    exclusions: Array,
    credits: Number,
    terms: String,
    cancellactionPolicy:String
});

module.exports = mongoose.model('trip', tripsSchema)