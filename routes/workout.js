var express = require('express');
var router = express.Router();

const { workoutData } = require("../models/workoutData");

router.get("/", (req, res) => {
    res.status(200).send({ message: "운동 기록 페이지" });
});

router.get('/getData', async (req, res) => {
    try {
        const startOfDay = new Date(req.query.startOfDay);
        const endOfDay = new Date(req.query.endOfDay);

        const woData = await workoutData.find({
            userToken: req.query.userToken,
            workoutDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        if (woData && woData.length > 0) {
            res.status(200).json({ woData });
        } else {
            res.status(404).json({
                message: "No workoutData found for the specified date range",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
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