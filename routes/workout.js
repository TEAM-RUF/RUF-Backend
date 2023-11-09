var express = require('express');
var router = express.Router();

const { workoutData } = require("../models/workoutData");

router.get("/", (req, res) => {
    res.status(200).send({ message: "운동 기록 페이지" });
});

router.get('/getData', async (req, res) => {
    console.log(new Date(req.query.startOfDay));
    console.log(new Date(req.query.endOfDay));

    const woData = await workoutData.find({
        userToken: req.query.token,
        workoutDate: {
            $gte: new Date(req.query.startOfDay),
            $lte: new Date(req.query.endOfDay)
        }
    });

    if (woData || !Object.keys(woData).length) {
        res.status(200).json({ woData });
    } else {
        res.status(500).json({
            message: "No such workoutData",
        });
    }
});

router.post('/postData', async (req, res) => {
    try {
        const woData = new workoutData(req.body);
        const woState = await woData.save();

        if (!woState) {
            const err = new Error("Internal Server Error");
            res.status(400).json({ success: false, err });
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            sucess: false,
            message: err.message
        });
    }
});

module.exports = router; 