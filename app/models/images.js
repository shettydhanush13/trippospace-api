var mongoose = require("mongoose")
var schema = mongoose.Schema

var imageSchema = new schema({
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