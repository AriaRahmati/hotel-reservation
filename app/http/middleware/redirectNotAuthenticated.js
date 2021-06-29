const Middleware = require("app/http/middleware/middleware");

class RedirectNotAuthenticated extends Middleware {
	handle(req, res, next) {
		if (!req.isAuthenticated()) res.redirect('/auth/login');
		next();
	}
}

module.exports = new RedirectNotAuthenticated();