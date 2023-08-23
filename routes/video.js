const express = require('express');
const multer = require('multer');
const { Readable } = require('stream');
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const VideoModel = require('../models/videoData');
const { GridFSBucket } = require('mongodb');
var router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
	try {
		if (!req.file) {
			throw new Error('No file uploaded.');
		}
		
		const file = req.file;
		
		const conn = mongoose.connection;
		const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
			bucketName: 'uploads'
		});
			const uploadStream = bucket.openUploadStream(file.originalname, {
			contentType: file.mimetype
		});
		
		const readableStream = new Readable();
		readableStream.push(file.buffer);
		readableStream.push(null);
		
		readableStream.pipe(uploadStream);
		
		uploadStream.on('finish', async (uploadedFile) => {
			const video = new VideoModel({
				title: req.body.title,
				description: req.body.description,
				filename: uploadedFile.filename,
				contentType: uploadedFile.contentType,
				userToken: req.body.userToken,
			});
			
			await video.save();
			
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

module.exports = router;
	