const Validator = require('app/http/validators/validator');
const { check, body } = require('express-validator');

class RegisterValidator extends Validator {
	handle() {
		return [
			check('name')
				.isLength({ min: 4 })
				.withMessage('نام نمی‌تواند کمتر از 4 کارکتر باشد'),
			check('email')
				.isEmail()
				.withMessage('فرمت ایمیل معتبر نمی‌باشد'),
			check('password')
				// 	.isLength({ min: 8, max: 32 })
				// 	.withMessage('رمز عبور باید بین ۸ تا ۳۲ کارکتر باشد')
				.custom(async (value, { req }) => {
					const { password } = req.body;
					if (req.query._method === 'PUT' && !password) return

					if (password.length < 8 || password.length > 32)
						throw new Error('رمز عبور باید بین ۸ تا ۳۲ کارکتر باشد');
				}),
		];
	}
}

module.exports = new RegisterValidator();