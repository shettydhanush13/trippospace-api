var mongoose = require("mongoose")
var schema = mongoose.Schema

var organizerNotificationsSchema = new schema({
    organizerId: String,
    type: String,
    date: String,
    timestamp: String,
    content: Object,
    seen : Boolean
});

module.exports = mongoose.model('organizerNotifications', organizerNotificationsSchema)