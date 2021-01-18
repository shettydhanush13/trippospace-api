const mongoose = require("mongoose")
const schema = mongoose.Schema

const pendingReviewSchema = new schema({
    tripDetails : Object,
    user: String
});

module.exports = mongoose.model('pendingreview', pendingReviewSchema)

