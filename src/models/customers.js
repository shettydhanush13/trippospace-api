const mongoose = require("mongoose")
const schema = mongoose.Schema

const customerSchema = new schema({
    name: String,
    phone: String,
    mail: String,
    id: String,
    source: String,
    
});

module.exports = mongoose.model('customers', customerSchema)