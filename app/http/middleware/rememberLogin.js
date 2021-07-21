const Middleware = require("app/http/middleware/middleware");

const User = require("app/models/user");
class RememberLogin extends Middleware {
	handle(req, res, next) {
		if (!req.isAuthenticated()) {
			const rememberToken = req.signedCookies.remember_token;
			if (rememberToken) {
				return this.findUser(rememberToken, req, next);
			}
		}

		next();
	}

	findUser(rememberToken, req, next) {
		User.findOne({ rememberToken })
			.then(user => {
				if (user) {
					req.login(user, err => {
						if (err) console.error(err);
						next();
					});
				} else {
					next();
				}
			});
	}
}

module.exports = new RememberLogin();