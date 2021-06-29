const Middleware = require("app/http/middleware/middleware");

class RedirectAuthenticated extends Middleware {
	handle(req, res, next) {
		if (req.isAuthenticated()) res.redirect('/');
		next();
	}
}

module.exports = new RedirectAuthenticated();