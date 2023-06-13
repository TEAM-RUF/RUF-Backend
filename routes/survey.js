var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();

const { SurveyData } = require("../models/survey_data");

router.get("/", (req, res) => {
  	res.status(200).send({message : "설문조사 로직"});
});

router.post('/addSurvey', async (req, res) => {
	try {
		const token = req.body.token;
		const surveyData = new SurveyData(req.body);
		const surveyID = await SurveyData.getIdByToken(token);
		
		if(!surveyID){
			// 해당 유저 없음
			return res.status(500).json({success: false, err : "No Such User"});
		}else if(surveyID == "N/A"){
			// 설문조사 추가
			const surveyAddStatus = await surveyData.save();
			await SurveyData.saveSurveyID(surveyAddStatus._id, token);
			
			if (!surveyAddStatus){
				const err = new Error("Internal Server Error");
				return res.status(500).json({success: false, err});
			}
			
			console.log(surveyAddStatus);
			return res.status(200).json({success: true});
		}else{
			// 설문조사가 존재하는 상태에서 요청이 들어왔을 때
			return res.status(400).json({success: false, err : "Survey already exists"});
		}
	}catch (err) {
		res.status(500).send(err);
		console.log(err);
	}
});

module.exports = router;