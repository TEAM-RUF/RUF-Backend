var express = require('express');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const ObjectID = require('mongodb').ObjectId;
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
		maxlength: 50,
	},
	lastSurvey: {
		type: Date,
		default: Date.now,
		required: false,
	},
});

surveySchema.statics.getIdByToken = async (token) => {
	try {
		const _id = await UserData.getIdByToken(token);
		// promise 형태로 넘어오는 _id를 처리 이후 find
		const user = await UserData.findById(new ObjectID(_id));
		// await를 사용할 때 에러가 발생하는 경우가 있음 (ide 문제?)
		return user.surveyID;
	} catch (err) {
		return null;
	}
};

surveySchema.statics.saveSurveyID = async (_surveyID, token) => {
	try {
		const _id = await UserData.getIdByToken(token);
		const user = await UserData.findOneAndUpdate(
			{ _id: new ObjectID(_id) },
			{ surveyID: _surveyID }
		);
	} catch (err) {
		console.log(err);
		return err;
	}
};

const SurveyData = mongoose.model("SurveyData", surveySchema);

module.exports = { SurveyData };