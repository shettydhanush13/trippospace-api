var mongoose = require("mongoose")
var schema = mongoose.Schema

var organizersSchema = new schema({
    name: String,
    username: String,
    profilePic: String,
    coverPic: String,
    website: String,
    location: String,
    description: String,
    trips: Array,
    rating: Number,
    social: {
        facebook: String,
        twitter: String,
        instagram: String
    },
    contact: {
        phone: String,
        mail: String,
    }
});

module.exports = mongoose.model('organizer', organizersSchema)