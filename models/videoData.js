const mongoose = require('mongoose');


const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    filename: String,
    contentType: String,
	userToken: {
		type: String,
		// required: true
	},
});


module.exports = mongoose.model('Video', videoSchema);