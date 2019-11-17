var mongoose = require("mongoose")
var schema = mongoose.Schema

var usersSchema = new schema({
    first_name: String,
    last_name: String,
    username: String,
    password: String,
    email: String,
    phone: String,
    profile_pic: String,
    cover_pic: String,
    social: Object,
    stats: Object,
    trips: Array
});

module.exports = mongoose.model('users', usersSchema)