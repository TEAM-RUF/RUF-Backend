const mongoose = require('mongoose');

const setDetailSchema = new mongoose.Schema({
    set: Number,    // 세트
    weight: Number, // 무게
    number: Number, // 횟수
});

const summarizeSchema = new mongoose.Schema({
    RM: Number,         // RM
    accuracy: Number,   // 정밀도
    maxWeight: Number,  // 최대무게
    volume: Number,     // 볼륨
});

const workoutDataSchema = new mongoose.Schema({
    userToken: {
        type: String,
        required: true
    },
    workoutDate: {
        type: Date,
        default: Date.now,
        required: false,
    },
    workoutVideoUrl: Array,
    workoutProcUrl: Array,
    setDetail: [
        setDetailSchema
    ],
    summarize: summarizeSchema
});

module.exports = {
    workoutData: mongoose.model('workoutData', workoutDataSchema)
};