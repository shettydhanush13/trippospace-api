
var mongoose = require("mongoose")
var schema = mongoose.Schema

var organizerstatsSchema = new schema({
    organizerName:String,
    organizerId:String,
    stats:Object,
    trips:Object
});

module.exports = mongoose.model('organizerstats', organizerstatsSchema)