var express = require('express');
var router = express.Router();

const { UserData } = require("../models/user_data");

router.get("/", (req, res) => {
  	res.status(200).send({message : "사용자 인증 페이지"});
});

router.post('/signup', async (req, res) => {
	console.log(req.body);
	
	try {
		const userData = new UserData(req.body);
		//post로 넘어온 데이터를 받아서 DB에 저장
		//user 모델에서 mongoose에 연결 => 바로 데이터베이스에 저장
		const userStatus = await userData.save();

		if (!userStatus){
			const err = new Error("Internal Server Error");
			res.status(400).json({success: false, err});
		}
		res.status(200).json({success: true});
		console.log(userStatus);
	}catch (err) {
		res.status(500).send(err);
		console.log(err);
	}
});

module.exports = router;