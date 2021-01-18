const mongoose = require("mongoose")
const schema = mongoose.Schema

const cartSchema = new schema( {
    productId:String,
    title:String,
    price:Number,
    thumb:String,
    color: Object,
    size:String,
    userId:String,
    quantity:Number
});

module.exports = mongoose.model('cart', cartSchema)
