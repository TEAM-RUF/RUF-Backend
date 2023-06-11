const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const  ObjectID = require('mongodb').ObjectId;
const { UserData } = require("./user_data");

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

surveySchema.statics.getIdByToken  = async (token) => {
  	const _id = UserData.getIdByToken(token);
	console.log(_id);
	const user = UserData.findById(new ObjectID(_id));
	
	return user.surveyID;
};

const SurveyData = mongoose.model("SurveyData", surveySchema);

module.exports = { SurveyData };