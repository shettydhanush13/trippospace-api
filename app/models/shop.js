var mongoose = require("mongoose")
var schema = mongoose.Schema

var shopSchema = new schema({
    title:String,
    price:Number,
    sizes :Array,
    description:Array,
    product:Number,
    colors:Array
});

module.exports = mongoose.model('shop', shopSchema)
