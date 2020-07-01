let mongoose = require("mongoose")
let schema = mongoose.Schema

let skillUsersSchema = new schema({
    info : Object,
    courses : Object
});

module.exports = mongoose.model('skillUsers', skillUsersSchema)


