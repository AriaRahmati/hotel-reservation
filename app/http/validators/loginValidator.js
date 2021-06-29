const Validator = require('app/http/validators/validator');
const { check } = require('express-validator');

class LoginValidator extends Validator {
	handle() {
		return [
			check('email')
				.isEmail()
				.withMessage('فرمت ایمیل معتبر نمی‌باشد'),
			check('password')
				.isLength({ min: 8, max: 32 })
				.withMessage('رمز عبور باید بین ۸ تا ۳۲ کارکتر باشد')
		];
	}
}

module.exports = new LoginValidator();