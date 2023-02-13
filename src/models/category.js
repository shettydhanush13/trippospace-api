const mongoose = require("mongoose")
const schema = mongoose.Schema

const categorySchema = new schema({
    id: String,
    title: String,
    trips: Number,
});

module.exports = mongoose.model('categories', categorySchema)
