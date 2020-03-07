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
    stats: Object,
    social:Object
});

module.exports = mongoose.model('users', usersSchema)


