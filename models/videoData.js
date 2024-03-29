const mongoose = require('mongoose');


const videoSchema = new mongoose.Schema({
    filename: String,   // 동영상 이름
    contentType: String,
    workout: String,    // 운동 종류
    set: Number,        // 해당 세트
    userToken: {
        type: String,
        // required: true
    },
    actToken: {         // Video들을 구분하기 위한 ActToken
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now,
        required: false,
    },
});

module.exports = mongoose.model('Video', videoSchema);