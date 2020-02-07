var mongoose = require("mongoose")
var schema = mongoose.Schema

var customerSchema = new schema({
    name: String,
    phone: String,
    mail: String,
    id: String,
    source: String,
    
});

module.exports = mongoose.model('customers', customerSchema)