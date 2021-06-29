const autoBind = require('auto-bind');
const { validationResult } = require('express-validator');

const Recaptcha = require('express-recaptcha').RecaptchaV2;

class Controller {
	constructor() {
		autoBind(this);
		this.setRecaptcha();
	}

	setRecaptcha() {
		this.recaptcha = new Recaptcha(config.service.RECAPTCHA.SITE_KEY, config.service.RECAPTCHA.SECRET_KEY, config.service.RECAPTCHA.OPTIONS);
	}

	async validationRecaptcha(req, res) {
		return new Promise((resolve, reject)=>{
			this.recaptcha.verify(req, (err, data) => {
				if (err) {
					req.flash('errors', 'گزینه‌ی امنیتی فعال نمی‌باشد');
					this.back(req, res);
				} else {
					resolve();
				}
			});
		});
	}

	async validationForm(req, res) {
		const result = await validationResult(req);
		if (!result.isEmpty()) {
			const errors = result.array();
			const messages = [];
			errors.forEach(err => { messages.push(err.msg) })
			req.flash('errors', messages);
			this.back(req, res);
			return false;
		} else {
			return true;
		}
	}

	back(req, res) {
		return res.redirect(req.header('Referer') || '/');
	}
}

module.exports = Controller;