var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const { GridFSBucket } = require('mongodb');
require('dotenv').config();

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// DB connection
const dbAddress = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST;

mongoose.connect(dbAddress, {
	// useNewUrlPaser: true,
	// useUnifiedTofology: true,
	// useCreateIndex: true,
	// useFindAndModify: false,
}).then(() => {
	console.log("MongoDB Connected");

	const conn = mongoose.connection;

	// GridFSBucket 설정
	const bucket = new GridFSBucket(conn.db, {
		bucketName: 'uploads' // GridFS 버킷 이름
	});

	console.log("GridFSBucket Setting Completed");

	const indexRouter = require('./routes/index');
	const authRouter = require('./routes/auth');
	const videoRouter = require('./routes/video');
	const workoutRouter = require('./routes/workout');

	// Body-parser 미들웨어 등록
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));

	// 배포시 CORS 조정 필요
	const corsOptions = {
		origin: [
			"http://localhost:3000",
			"https://ruf-react-service.vercel.app/"
		],
		credentials: true,
	};

	app.use(cors(corsOptions));


	// 라우팅 설정
	app.use('/', indexRouter);
	app.use('/auth', authRouter);
	app.use('/video', videoRouter);
	app.use('/workout', workoutRouter);
	console.log("Router Setting Completed");

	app.use(function (req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// error handler
	app.use(function (err, req, res, next) {
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		// render the error page
		res.status(err.status || 500);
		res.render('error');
	});

	console.log("Err Handler Setting Completed");

	var port = 3030;
	app.listen(
		process.env.PORT || port,
		() => console.log('RUF Server is Listening : ' + port)
	);

}).catch((err) => {
	console.log(err);
});

module.exports = app;
