const Validator = require('app/http/validators/validator');
const { check } = require('express-validator');

class ForgetPasswordValidator extends Validator {
	handle() {
		return [
			check('email')
				.isEmail()
				.withMessage('فرمت ایمیل معتبر نمی‌باشد'),
		];
	}
}

module.exports = new ForgetPasswordValidator();