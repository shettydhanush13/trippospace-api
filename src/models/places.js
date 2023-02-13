const mongoose = require("mongoose")
const schema = mongoose.Schema

const placesSchema = new schema({
    title : String,
    alternateName: String,
    months: Array,
    thumb : String,
    desc : String,
    article: Object,
    coOrdinates : Object
});

module.exports = mongoose.model('places', placesSchema)

