
const Controller = require('app/http/controllers/controller');

const User = require('app/models/user');
const PasswordReset = require('app/models/passwordReset');

class ResetPasswordController extends Controller {
	showForm(req, res) {
		res.render('home/auth/password/email', { recaptcha: this.recaptcha.render() });
	}

	async resetPasswordProcess(req, res, next) {
		await this.validationRecaptcha(req, res)
		const result = await this.validationForm(req, res);
		if (result)
			this.resetPassword(req, res, next);
	}

	async resetPassword(req, res, next) {
		// @TEMP
		const url = req.headers.referer.split('/');
		req.body.token = url.pop();
		//

		const passwordReset = await PasswordReset.findOne({ token: req.body.token });
		if (!passwordReset) {
			const error = 'لینک وارد شده معتبر نمی‌باشد';
			req.flash('errors', error);
			return this.back(req, res);
		}

		if (passwordReset.used) {
			const error = 'از این لینک قبلا برای تغییر رمز عبور استفاده شده است';
			req.flash('errors', error);
			return this.back(req, res);
		}

		const user = await User.findOneAndUpdate({ email: passwordReset.email }, { $set: { password: req.body.password } });
		if (!user) {
			const error = 'کاربری با این مشخصات در سیستم وجود ندارد';
			req.flash('errors', error);
			return this.back(req, res);
		}

		await passwordReset.updateOne({ used: true });

		res.redirect('/auth/login');
	}
}

module.exports = new ResetPasswordController();