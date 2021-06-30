const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('app/models/user');

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use('local.register', new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, (req, email, password, done) => {
	User.findOne({ 'email': email }, (err, user) => {
		if (err) return done(err);
		if (user) {
			const error = 'قبلا کاربری با این مشخضات در سیستم ثبت نام کرده';
			req.flash('errors', error);
			return done(null, false, { message: error });
		}

		const newUser = new User({
			name: req.body.name,
			email,
			password
		});

		newUser.save(err => {
			if (err) {
				const error = 'امکان ثبت اطلاعات کاربر وجود ندارد';
				req.flash('errors', error);
				return done(err, false, { message: error });
			}
			done(null, newUser);
		});
	})
}));

passport.use('local.login', new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, (req, email, password, done) => {
	User.findOne({ 'email': email }, (err, user) => {
		if (err) return done(err);
		if (!user) {
			const error = 'کاربری با این مشخصات در سیستم ثبت‌نام نکرده است';
			req.flash('errors', error);
			return done(null, false, { message: error });
		}

		if (!user.comparePassword(password)) {
			const error = 'رمز عبور اشتباه وارد شده است';
			req.flash('errors', error);
			return done(null, false, { message: error });
		}

		done(null, user);
	});
}));