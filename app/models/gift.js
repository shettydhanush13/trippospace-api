var mongoose = require("mongoose")
var schema = mongoose.Schema

var giftSchema = new schema({
    code : String,
    value : Number,
    redeemed : Boolean
});

module.exports = mongoose.model('gift', giftSchema)


