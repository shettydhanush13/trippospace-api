const mongoose = require("mongoose")
const schema = mongoose.Schema

const giftSchema = new schema({
    code : String,
    value : Number,
    redeemed : Boolean
});

module.exports = mongoose.model('gift', giftSchema)


