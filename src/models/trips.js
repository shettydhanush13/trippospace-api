const mongoose = require("mongoose")
const schema = mongoose.Schema

const tripsSchema = new schema({
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
        allDates: Array,
        departureCity: String,
        price: Number,
        lowestPrice : Number
    },
    date: String,
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
    notes:Array,
    tripId:String
});

module.exports = mongoose.model('trip', tripsSchema)