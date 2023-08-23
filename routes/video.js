const express = require('express');
const multer = require('multer');
const Grid = require('gridfs-stream');
const { Readable } = require('stream');
const mongoose = require('mongoose');
const VideoModel = require('../models/videoData');
var router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

let gfs;
router.use((req, res, next) => {
    if (!gfs) {
        const conn = mongoose.connection;
        gfs = Grid(conn.db, mongoose.mongo);
        gfs.collection('uploads');
    }
    next();
});

router.post('/upload', async (req, res) => {
	try {
		// GridFS 스트림 생성 및 업로드
		const writestream = gfs.createWriteStream({
			filename: req.file.originalname,
			contentType: req.file.mimetype,
		});

		const readableStream = new Readable();
		readableStream.push(req.file.buffer);
		readableStream.push(null);

		readableStream.pipe(writestream);

		writestream.on('close', async (file) => {
			// 업로드 된 파일의 메타데이터와 Video 모델을 사용하여 새로운 비디오 생성
			const video = new VideoModel({
				title: req.body.title,
				description: req.body.description,
				filename: file.filename,
				contentType: file.contentType,
				userToken: req.body.userToken,
			});

			await video.save(); // MongoDB에 저장

			return res.status(200).json({
				sucess: true,
				message : "File upload success",
			});
		});
	}catch (err) {
		console.log(err);
		return res.status(500).json({
			sucess: false,
			message : err.message
		});
	}
});

module.exports = router;