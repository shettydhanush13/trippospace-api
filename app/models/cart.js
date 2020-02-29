var mongoose = require("mongoose")
var schema = mongoose.Schema

var cartSchema = new schema( {
    productId:String,
    title:String,
    price:Number,
    thumb:String,
    color: String,
    size:String,
    userId:String
});

module.exports = mongoose.model('cart', cartSchema)
