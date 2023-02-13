const mongoose = require("mongoose")
const schema = mongoose.Schema

const organizerNotificationsSchema = new schema({
    organizerId: String,
    type: String,
    date: String,
    timestamp: String,
    content: Object,
    seen : Boolean
});

module.exports = mongoose.model('organizerNotifications', organizerNotificationsSchema)