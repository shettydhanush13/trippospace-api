const mongoose = require("mongoose")
const schema = mongoose.Schema

const payoutsSchema = new schema( {
    name: String,
    id : String,
    date : String,
    mail: String,
    accountId : String,
    travelers : Number,
    price : Number,
    pending : Number,
    commission : Number,
    toBePaid: Number,
    settled : Boolean
});

module.exports = mongoose.model('Payouts', payoutsSchema)
