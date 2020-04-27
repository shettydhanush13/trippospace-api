var mongoose = require("mongoose")
var schema = mongoose.Schema

var videoSchema = new schema({
    title: String,
    thumb: String,
    link: String,
    key: String,
    type: String
});

module.exports = mongoose.model('videos', videoSchema)