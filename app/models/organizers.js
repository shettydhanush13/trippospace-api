var mongoose = require("mongoose")
var schema = mongoose.Schema

var organizersSchema = new schema({
    name: String,
    logo: String,
    website: String,
    location: String,
    description: String,
    contact: {
        phone: String,
        mail: String,
        social: {
            facebook: String,
            twitter: String,
            instagram: String
        }
    }
});

module.exports = mongoose.model('organizer', organizersSchema)