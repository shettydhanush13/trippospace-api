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
    tags: Array,
    isFav: Boolean,
    place: Array,
    organizer: {
        id: String,
        logo: String,
        name: String,
        username: String,
        cancellationPolicy: String
    },
    booking: {
        slots: Number,
        customerList: Array,
        days: Number,
        date: String,
        departureCity: String,
        priceBefore: Number,
        priceAfter: Number
    },
    itinerary: Array,
    pickup: Array,
    inclusions: Array,
    exclutions: Array
});

module.exports = mongoose.model('trip', tripsSchema)