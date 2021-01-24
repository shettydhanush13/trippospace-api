const mongoose = require("mongoose")
const schema = mongoose.Schema

const organizersSchema = new schema({
    name: String,
    username: String,
    password: String,
    profile_pic: String,
    cover_pic: String,
    website: String,
    location: String,
    description: String,
    trips: Array,
    rating: Number,
    reviews: Array,
    social: Object,
    accountId : String,
    contact: Object
});

module.exports = mongoose.model('organizer', organizersSchema)