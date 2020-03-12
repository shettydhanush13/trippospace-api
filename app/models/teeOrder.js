var mongoose = require("mongoose")
var schema = mongoose.Schema

var teeOrderSchema = new schema({
    dateOfPurchase : String,
    delivered : Boolean,
    waybill : String,
    orderId : String,
    refnum : String,
    title: String,
    price: Number,
    thumb: String,
    color: String,
    colorCode : String,
    size: String,
    userId: String,
    quantity: Number,
});

module.exports = mongoose.model('teeOrder', teeOrderSchema)
                    
                    