var mongoose = require("mongoose")
var schema = mongoose.Schema

var pendingReviewSchema = new schema({
    tripDetails : Object,
    user: String
});

module.exports = mongoose.model('pendingreview', pendingReviewSchema)

