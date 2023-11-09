const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
	email: {				// 이메일, 로그인을 위해 사용
		type: String,
		trim: true,
		unique: true,
		required: true
	},
	password: {				// 비밀번호
		type: String,
		minLength: 4,
		required: true
	},
	name: {					// 이름
		type: String,
		required: true
	},
	phoneNumber: {			// 핸드폰 번호
		type: String,
		required: true
	},
	deviceOS: {				// 디바이스 OS 정보
		type: String,		// 사용자에게 직접 입력받는 부분이 아니기에
		required: false		// required 를 false로 설정함
	},
	region: {				// 지역정보
		type: String,
		required: true
	},
	age: {					// 연령정보
		type: Number,
		required: true
	},
	OAuthInfo: {			// OAuth 인증 종류 (KAKAO, Facebook etc)
		type: String,		// 추후 OAuth를 적용할 때 사용
		required: false
	},
	isMarketingAgree: {		// 마케팅 수신 동의 여부
		type: Boolean,
		required: true
	},
	isLogTraceAgree: {		// 사용자 로그 추적 동의 여부
		type: Boolean,
		required: true
	},
	healthAppAgree: {		// 건강 앱 연동 여부
		type: Boolean,		// IOS 한정
		required: false
	},
});

//save 메소드가 실행되기전에 비밀번호를 암호화
userSchema.pre("save", function (next) {
	let user = this;

	//model 안의 paswsword가 변환될때만 암호화
	if (user.isModified("password")) {
		bcrypt.genSalt(saltRounds, function (err, salt) {
			if (err) return next(err);
			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) return next(err);
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

userSchema.methods.comparePassword = function (plainPassword) {
	//plainPassword를 암호화해서 현재 비밀번호화 비교
	return bcrypt
		.compare(plainPassword, this.password)
		.then((isMatch) => isMatch)
		.catch((err) => err);
};

userSchema.methods.generateToken = function () {
	// let user = this;
	const token = jwt.sign(this._id.toHexString(), "secretToken");
	this.token = token;

	return this.save()
		.then((user) => user)
		.catch((err) => err);
};

userSchema.statics.getIdByToken = async (token) => {
	return jwt.verify(token, "secretToken", function (err, decoded) {
		try {
			return decoded;
		} catch (err) {
			return err;
		}
	}
	)
};

const UserData = mongoose.model("UserData", userSchema);

module.exports = { UserData };