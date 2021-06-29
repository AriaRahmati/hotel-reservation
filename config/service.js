module.exports = {
	RECAPTCHA: {
		SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
		SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
		OPTIONS: {
			hl: 'fa'
		}
	},
	GOOGLE: {
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.GOOGLE_CALLBACK_URL
	},
	ZARINPAL: {
		MerchantID: process.env.ZARINPAL_MERCHANTID
	}
};