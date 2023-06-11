const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const { UserData } = require("../models/user_data");

const surveySchema = mongoose.Schema({
	machine: {
		type: String,
		maxlength: 50,
	},
	extime: {
		type: String,
		maxlength: 50,
	},
	experienceLevel: {
		type: String,
		minLength: 50,
	},
	lastSurvey: {
		type: Date,
		default: Date.now,
		required: false,
	},
});

surveySchema.statics.findByUserToken = function (token) {
	const user = UserData.findByToken(req.query.token);
	if(!user)
		return -1; // no such user
	return user.surveyID();
};

const SurveyData = mongoose.model("SurveyData", surveySchema);

module.exports = { SurveyData };