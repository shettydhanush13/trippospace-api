const mongoose = require("mongoose")
const schema = mongoose.Schema

const imageSchema = new schema({
    imageName: {
        type: String,
        default: "none",
        required: true
    },
    imageData: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('image', imageSchema)