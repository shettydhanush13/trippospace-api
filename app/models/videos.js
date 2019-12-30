var mongoose = require("mongoose")
var schema = mongoose.Schema

var videoSchema = new schema({
    id: String,
    title: String,
    place: Array,
    tags: Array
});

module.exports = mongoose.model('videos', videoSchema)
