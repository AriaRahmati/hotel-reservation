const Middleware = require("app/http/middleware/middleware");

class FileToField extends Middleware {
	handle(req, res, next) {
		if (!req.file)
			req.body.images = undefined;
		else
			req.body.images = req.file.originalname;

		next();
	}
}

module.exports = new FileToField();