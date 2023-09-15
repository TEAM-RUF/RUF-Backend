var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send({ message: "영상처리 로직 라우터" });
});

module.exports = router;