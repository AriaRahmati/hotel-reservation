const Controller = require('app/http/controllers/controller');

const passport = require('passport');

class RegisterController extends Controller {
	showForm(req, res) {
		res.render('home/auth/register', { recaptcha: this.recaptcha.render() });
	}

	async registerProcess(req, res, next) {
		await this.validationRecaptcha(req, res)
		const result = await this.validationForm(req, res);
		if (result)
			this.register(req, res, next);
	}

	register(req, res, next) {
		passport.authenticate('local.register', {
			successRedirect: '/',
			successMessage: 'با موفقیت ثبت‌نام کردید',
			failureRedirect: '/auth/register',
			failureMessage: 'ثبت نام ناموفق',
			failureFlash: true,
		})(req, res, next);
	}
}

module.exports = new RegisterController();