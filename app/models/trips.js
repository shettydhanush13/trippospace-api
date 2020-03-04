var mongoose = require("mongoose")
var schema = mongoose.Schema

var tripsSchema = new schema({
    title: String,
    destination: String,
    thumb: String,
    description: String,
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
        price: Number,
    },
    partialPay:Number,
    tripTypes:Array,
    itinerary: Array,
    pickup: Array,
    inclusions: Array,
    exclusions: Array,
    credits: Number,
    terms: String,
    cancellationPolicy:String,
    thingsToCarry: Array,
    notes:Array
});

module.exports = mongoose.model('trip', tripsSchema)