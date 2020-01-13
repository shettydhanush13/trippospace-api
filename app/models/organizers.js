var mongoose = require("mongoose")
var schema = mongoose.Schema

var organizersSchema = new schema({
    name: String,
    username: String,
    password: String,
    profile_pic: String,
    cover_pic: String,
    website: String,
    location: String,
    description: String,
    trips: Number,
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