var express = require('express');
var router = express.Router();

const { SurveyData } = require("../models/survey_data");

router.get("/", (req, res) => {
  	res.status(200).send({message : "설문조사 로직"});
});

router.post('/addSurvey', async (req, res) => {
	try {
		const survey = SurveyData.findByUserToken(req.body.token);
		if(survey == -1){
			// 해당 유저 없음
			const err = new Error("No Such User");
			res.status(400).json({success: false, err});
		}else if(survey == "N/A"){
			// 설문조사 추가
			const surveyAddStatus = await survey.save();
			if (!surveyAddStatus){
				const err = new Error("Internal Server Error");
				res.status(400).json({success: false, err});
			}
			res.status(200).json({success: true});
			console.log(surveyAddStatus);
		}else{
			// 설문조사 업데이트
			res.status(400).json({success: false});
		}
	}catch (err) {
		res.status(500).send(err);
		console.log(err);
	}
});

module.exports = router;