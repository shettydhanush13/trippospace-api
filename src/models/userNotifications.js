const mongoose = require("mongoose")
const schema = mongoose.Schema

const usererNotificationsSchema = new schema({
    userId: String,
    type: String,
    date: String,
    timestamp: String,
    content: Object,
    seen : Boolean
});

module.exports = mongoose.model('userNotifications', usererNotificationsSchema)