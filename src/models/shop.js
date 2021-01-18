const mongoose = require("mongoose")
const schema = mongoose.Schema

const shopSchema = new schema({
    title:String,
    price:Number,
    sizes :Array,
    description:Array,
    product:Number,
    colors:Array
});

module.exports = mongoose.model('shopping', shopSchema)
