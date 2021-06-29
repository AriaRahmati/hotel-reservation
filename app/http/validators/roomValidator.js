const Validator = require('app/http/validators/validator');
const { check } = require('express-validator');
const path = require('path');

class RoomValidator extends Validator {
	handle() {
		return [
			check('title')
				.isLength({ min: 5 })
				.withMessage('عنوان اتاق نباید کمتر از ۵ کارکتر باشد'),
			check('type')
				.not().isEmpty()
				.withMessage('نوع اتاق را وارد کنید'),
			check('body')
				.not().isEmpty()
				.withMessage('توضیحات اتاق را وارد کنید'),
			check('images')
				.custom(async (value, { req }) => {
					if (!value && req.query._method === 'PUT') return;

					if (!value)
						throw new Error('تصویر اتاق را وارد کنید');
					else {
						const fileExts = ['.png', '.jpg', '.jpeg', '.svg'];
						if (!fileExts.includes(path.extname(value))) throw new Error('فایل انتخابی تصویر نمی‌باشد');
					}
				}),
			check('price')
				.not().isEmpty()
				.withMessage('قیمت اتاق را وارد کنید'),
			check('maxPeople')
				.not().isEmpty()
				.withMessage('حداکثر نفرات اتاق را وارد کنید'),
		];
	}
}

module.exports = new RoomValidator();