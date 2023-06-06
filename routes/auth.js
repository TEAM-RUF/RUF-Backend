var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
  	res.status(200).send({message : "사용자 인증 페이지"});
});

router.post('/signup', function(req, res, next) {
	console.log(req.body);
	res.status(200).json(req.body);
});

module.exports = router;