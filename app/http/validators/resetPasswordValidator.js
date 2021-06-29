const Validator = require('app/http/validators/validator');
const { check } = require('express-validator');

class ResetPasswordValidator extends Validator {
	handle() {
		return [
			check('password')
				.isLength({ min: 8, max: 32 })
				.withMessage('رمز عبور باید بین ۸ تا ۳۲ کارکتر باشد')
		];
	}
}

module.exports = new ResetPasswordValidator();