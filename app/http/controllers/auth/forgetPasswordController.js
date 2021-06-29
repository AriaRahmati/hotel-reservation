const Controller = require('app/http/controllers/controller');

const randomString = require('randomstring');

const User = require('app/models/user');
const PasswordReset = require('app/models/passwordReset');

class ForgetPasswordController extends Controller {
	showForm(req, res) {
		res.render('home/auth/password/reset', { recaptcha: this.recaptcha.render() });
	}

	async resetLinkProcess(req, res, next) {
		await this.validationRecaptcha(req, res)
		const result = await this.validationForm(req, res);
		if (result)
			this.resetLink(req, res, next);
	}

	async resetLink(req, res, next) {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			const error = 'کاربری با این ایمیل در سیستم ثبت‌نام نکرده است';
			req.flash('errors', error);
			return this.back(req, res);
		}

		const setPassword = new PasswordReset({
			email: req.body.email,
			token: randomString.generate(32)
		});

		await setPassword.save();

		req.flash('success', 'لینک تغییر رمز عبور به ایمیل وارد شده ارسال شد');
		res.redirect('/auth/password/reset')
	}
}

module.exports = new ForgetPasswordController();