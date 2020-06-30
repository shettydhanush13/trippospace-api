var mongoose = require("mongoose")
var schema = mongoose.Schema

var skillUsersSchema = new schema({
    name: String,
    email: String,
    phone: String,
    profile_pic: String,
    stats: Object,
    referalCode:String,
});

module.exports = mongoose.model('skillUsers', skillUsersSchema)


