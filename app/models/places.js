var mongoose = require("mongoose")
var schema = mongoose.Schema

var placesSchema = new schema({
    title : String,
    alternateName: String,
    months: Array,
    thumb : String,
    desc : String,
    article: Object
});

module.exports = mongoose.model('places', placesSchema)

