var mongoose = require("mongoose")
var schema = mongoose.Schema

var categorySchema = new schema({
    id: String,
    title: String,
    trips: Number,
});

module.exports = mongoose.model('categories', categorySchema)
