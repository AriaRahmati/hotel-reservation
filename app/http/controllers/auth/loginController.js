const Controller = require('app/http/controllers/controller');

const passport = require('passport');

class LoginController extends Controller {
	showForm(req, res) {
		res.render('home/auth/login', { recaptcha: this.recaptcha.render() });
	}

	async loginProcess(req, res, next) {
		await this.validationRecaptcha(req, res)
		const result = await this.validationForm(req, res);
		if (result)
			this.login(req, res, next);
	}

	async login(req, res, next) {
		passport.authenticate('local.login', (err, user) => {
			if (!user) return res.redirect('/auth/login');

			req.login(user, err => {
				if (err) console.error(err);

				if (req.body.remember) {
					user.setRememberToken(res);
				}


				return res.redirect('/');
			});
		})(req, res, next);

	}
}

module.exports = new LoginController();