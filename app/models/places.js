var mongoose = require("mongoose")
var schema = mongoose.Schema

var placesSchema = new schema({
    title: String,
    alternate_name: Array,
    thumb: String,
    videos: Array,
    location: Object,
    explore: Boolean,
});

module.exports = mongoose.model('places', placesSchema)

