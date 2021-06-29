const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('app/models/user');

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(new googleStrategy({
    clientID: config.service.GOOGLE.clientID,
    clientSecret: config.service.GOOGLE.clientSecret,
    callbackURL: config.service.GOOGLE.callbackURL
  },
  function(token, tokenSecret, profile, done) {
	  User.findOne({email: profile._json.email}, (err, user) => {
		  if (err) return done(err);
		  if (user) return done(null, user);
		 
		  const newUser = new User({
			  name: profile._json.name,
			  email: profile._json.email,
			  password: profile._json.sub
		  });

		  newUser.save(err => {
			  if (err) return done(err);

			  done(null, newUser);
		  });
	  })
  }
));