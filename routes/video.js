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

router.get('/', function (req, res, next) {
	const filename = req.query.filename;
	res.render('stream', { filename });
});

router.get('/stream', async (req, res) => {
	try {
		const conn = mongoose.connection;
		const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
			bucketName: 'uploads'
		});

		const filename = req.query.filename;
		const downloadStream = bucket.openDownloadStreamByName(filename);

		res.setHeader('Content-Type', 'video/mp4');
		res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

		downloadStream.pipe(res);
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
});

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
				message: 'Video upload success',
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

router.delete('/delete', async (req, res) => {
	try {
		const filename = req.query.filename;

		const conn = mongoose.connection;
		const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
			bucketName: 'uploads'
		});

		const fileQuery = { filename: filename };
		const filesCollection = conn.db.collection('uploads.files');

		const fileDoc = await filesCollection.findOne(fileQuery);
		await bucket.delete(fileDoc._id);

		await VideoModel.deleteOne({ filename: filename });

		return res.status(200).json({
			success: true,
			message: 'Video deleted successfully',
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
