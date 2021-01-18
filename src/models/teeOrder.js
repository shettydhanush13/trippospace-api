const mongoose = require("mongoose")
const schema = mongoose.Schema

const teeOrderSchema = new schema({
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
                    
                    