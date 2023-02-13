const mongoose = require("mongoose")
const schema = mongoose.Schema

const querySchema = new schema( {
    trip : Object,
    organizer : Object,
    user : Object,
    booking : Object,
    pricing : Object,
    status : Object,
    payment : Object,
    refund : Object
},{
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
});

module.exports = mongoose.model('queries', querySchema)