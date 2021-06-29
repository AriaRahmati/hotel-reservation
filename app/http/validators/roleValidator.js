const validator = require('./validator');
const { check } = require('express-validator');

const Role = require('app/models/role');

class RoleValidator extends validator {
	handle() {
		return [
			check('title')
				.isLength({ min: 3 })
				.withMessage('عنوان سطح دسترسی نباید کمتر از 3 کارکتر باشد')
				.custom(async (value, { req }) => {
					if (req.query._method === 'PUT') {
						const permission = await Role.findById(req.params.id);
						if (permission.title == value) return;
					}

					const permission = await Role.find({ title: value });
					if (permission.length)
						throw new Error('این سطح دسترسی قبلا ایجاد شده است');
				}),
			check('body')
				.not().isEmpty()
				.withMessage('توضیحات سطح دسترسی نمی‌تواند خالی باشد'),
			check('permissions')
				.not().isEmpty()
				.withMessage('دسترسی نمی‌تواند خالی باشد')
		]
	}
}

module.exports = new RoleValidator();