var mongoose = require("mongoose")
var schema = mongoose.Schema

var usererNotificationsSchema = new schema({
    userId: String,
    type: String,
    date: String,
    timestamp: String,
    content: Object,
    seen : Boolean
});

module.exports = mongoose.model('userNotifications', usererNotificationsSchema)