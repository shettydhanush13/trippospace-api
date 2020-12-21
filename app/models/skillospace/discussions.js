let mongoose = require('mongoose');
let schema = mongoose.Schema;

let skillDiscussionsSchema = new schema({
	id: String,
	discussions: Array
});

module.exports = mongoose.model('skillDiscussions', skillDiscussionsSchema);
