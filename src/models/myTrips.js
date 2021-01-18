const mongoose = require("mongoose")
const schema = mongoose.Schema

const myTripsSchema = new schema({  
    name : String,
    title : String,
    views: Number,
    latitude:Number,
    longitude: Number,
    images: Array,
    blog : String,
    userId: String,
    userName :String
});

module.exports = mongoose.model('myTrips', myTripsSchema)