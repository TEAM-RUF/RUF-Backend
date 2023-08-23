var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
  	res.status(200).send({message : "동영상 관련 로직"});
});


module.exports = router;