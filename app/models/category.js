var mongoose = require("mongoose")
var schema = mongoose.Schema

var categorySchema = new schema({
    id: String,
    title: String,
    image: Array,
    videos: Array,
    trips: Array,
    followers: Array,
    isFollowed: Boolean
});

module.exports = mongoose.model('categories', categorySchema)
