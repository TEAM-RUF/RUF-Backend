var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();

const { SurveyData } = require("../models/survey_data");

router.get("/", (req, res) => {
  	res.status(200).send({message : "설문조사 로직"});
});

router.post('/addSurvey', async (req, res) => {
	try {
		const surveyData = new SurveyData(req.body);
		const surveyID = SurveyData.getIdByToken(req.body.token);
		console.log(surveyID);
		
		if(!surveyID){
			// 해당 유저 없음
			return res.status(500).json({success: false, err : "No Such User"});
		}else if(surveyID == "N/A"){
			// 설문조사 추가
			const surveyAddStatus = await surveyData.save();
			if (!surveyAddStatus){
				const err = new Error("Internal Server Error");
				return res.status(500).json({success: false, err});
			}
			return res.status(200).json({success: true});
			console.log(surveyAddStatus);
		}else{
			// 설문조사 업데이트
			return res.status(400).json({success: false});
		}
	}catch (err) {
		res.status(500).send(err);
		console.log(err);
	}
});

module.exports = router;