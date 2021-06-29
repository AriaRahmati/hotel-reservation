const validator = require('./validator');
const { check } = require('express-validator');

const Permission = require('app/models/permission');

class PermissionValidator extends validator {
	handle() {
		return [
			check('title')
				.isLength({ min: 3 })
				.withMessage('عنوان دسترسی نباید کمتر از 3 کارکتر باشد')
				.custom(async (value, { req }) => {
					if (req.query._method === 'PUT') {
						const permission = await Permission.findById(req.params.id);
						if (permission.title == value) return;
					}

					const permission = await Permission.find({ title: value });
					if (permission.length)
						throw new Error('این دسترسی قبلا ایجاد شده است');
				}),
			check('body')
				.not().isEmpty()
				.withMessage('توضیحات دسترسی نمی‌تواند خالی باشد')
		]
	}
}

module.exports = new PermissionValidator();