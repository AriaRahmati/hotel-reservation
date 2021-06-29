const Middleware = require("app/http/middleware/middleware");

class CheckError extends Middleware {
	async get404(req, res, next) {
		try {
			res.status(404);
			throw new Error('صفحه مورد نظر شما وجود ندارد');
		} catch (error) {
			next(error);
		}
	}

	async handle(error, req, res, next) {
		const { statusCode = res.statusCode, message = '', stack = '' } = error;

		if (config.debug) return res.render('layouts/error', { statusCode, message, stack });

		res.render('layouts/error', { statusCode, message });
	}
}

module.exports = new CheckError();