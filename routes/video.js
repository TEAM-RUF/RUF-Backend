const express = require('express');
const multer = require('multer');
const { Readable } = require('stream');
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const VideoModel = require('../models/videoData');
var router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = (gfs) => {
	
	router.post('/upload', upload.single('file'), async (req, res) => {
		try {
			if (!req.file) {
				throw new Error('No file uploaded.');
			}
console.log("-1");
			const file = req.file;
			console.log(gfs.options); // GridFS 스트림 설정 옵션 출력
			console.log(gfs.dbName); // 사용 중인 데이터베이스 이름 출력
			console.log(gfs.bucketName); // GridFS 버킷 이름 출력

console.log("0");
			const writestream = gfs.createWriteStream({
				filename: file.originalname,
				contentType: file.mimetype,
			});

			console.log("1");
			const readableStream = new Readable();
			readableStream.push(file.buffer);
			readableStream.push(null);
console.log("2");
			readableStream.pipe(writestream);
console.log("3");
			writestream.on('close', async (uploadedFile) => {
				const video = new VideoModel({
					title: req.body.title,
					description: req.body.description,
					filename: uploadedFile.filename,
					contentType: uploadedFile.contentType,
					userToken: req.body.userToken,
				});
console.log("4");
				await video.save();
console.log("5");
				return res.status(200).json({
					success: true,
					message: 'File upload success',
				});
			});
		} catch (err) {
			console.error(err);
			return res.status(500).json({
				success: false,
				message: err.message,
			});
		}
	});
	
	return router;
}