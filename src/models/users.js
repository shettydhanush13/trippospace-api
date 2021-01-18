const mongoose = require("mongoose")
const schema = mongoose.Schema

const usersSchema = new schema({
    first_name: String,
    last_name: String,
    username: String,
    password: String,
    email: String,
    phone: String,
    profile_pic: String,
    stats: Object,
    bucketList:Array,
    social:Object,
    referalCode:String,
});

module.exports = mongoose.model('users', usersSchema)


