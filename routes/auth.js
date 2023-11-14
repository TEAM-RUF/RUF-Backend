var express = require('express');
var router = express.Router();
const firebase = require('firebase-admin');

const { UserData } = require("../models/userData");
const { log } = require('forever');

// controller로 분리하지 않고 route에서 바로 구현
router.get("/", (req, res) => {
	res.status(200).send({ message: "사용자 인증 로직" });
});

router.post('/signup', async (req, res) => {
	try {
		const userData = new UserData(req.body);
		const userStatus = await userData.save();

		if (!userStatus) {
			const err = new Error("Internal Server Error");
			res.status(400).json({ success: false, err });
		}
		res.status(200).json({ success: true });
		console.log(userStatus);
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			sucess: false,
			message: err.message
		});
	}
});

router.get('/login', async (req, res) => {
	try {
		const user = await UserData.findOne({ email: req.query.email })

		if (user) {
			user
				.comparePassword(req.query.password)
				.then((isMatch) => {
					if (!isMatch) {
						return res.json({
							loginSuccess: false,
							message: "Invalid Password",
						});
					}
					user
						.generateToken()
						.then((user) => {
							res
								// .cookie("x_auth", user.token)
								.status(200)
								.json({ loginSuccess: true, userToken: user.token }); // userId: user._id
						})
						.catch((err) => {
							res.status(400).send({ loginSuccess: false, err });
						});
				})
				.catch((err) => res.json({ loginSuccess: false, err }));
		} else {
			res.status(400).send({ loginSuccess: false, message: "No Such User" });
		}
	} catch (err) {
		return res.json({
			loginSuccess: false,
			message: err,
		});
	}
});

router.get('/getFirebaseUserToken', async (req, res) => {
	try {

		res.status(200).json({
			message: "Simple Register for testing Firebase auth",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Internal Server Error",
		});
	}
});

// for test only
router.post('/firebaseRegister', async (req, res) => {
	try {
		const result = await firebase.auth().createUser({
			email: req.body.email,
			password: req.body.password,
			displayName: req.body.username,
		});

		res.status(200).json({
			message: result,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Internal Server Error",
		});
	}
});

module.exports = router;