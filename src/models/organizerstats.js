
const mongoose = require("mongoose")
const schema = mongoose.Schema

const organizerstatsSchema = new schema({
    organizerName:String,
    organizerId:String,
    stats:Object,
    trips:Object
});

module.exports = mongoose.model('organizerstats', organizerstatsSchema)