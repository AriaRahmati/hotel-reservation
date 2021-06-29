const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const rememberLogin = require('app/http/middleware/rememberLogin');
const moment = require('moment-jalaali');
const Helper = require('app/helper');
const access = require('app/http/middleware/checkUserAccess');

moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });

const app = express();

class Application {
	constructor() {
		this.configServer();
		this.configDatabase();
		this.setConfig();
		this.setRoutes();
	}

	configServer() {
		const server = http.createServer(app);

		server.listen(3000, err => {
			if (err) return console.error(error);

			console.log('server run on port 3000');
		});
	}

	configDatabase() {
		mongoose.Promise = global.Promise;
		mongoose.connect(config.database.URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		});
	}

	setConfig() {
		require('./passport/passport-local');
		require('./passport/passport-google');
		app.use(express.static(config.layout.PUBLIC_DIR));
		app.set('view engine', config.layout.VIEW_ENGINE);
		app.set('views', config.layout.VIEW_DIR);
		app.use(config.layout.EJS.expressLayout);
		app.set('layout', config.layout.EJS.master);
		app.set('layout extractScripts', config.layout.EJS.extractScripts);
		app.set('layout extractStyles', config.layout.EJS.extractStyles);
		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));
		app.use(session({ ...config.session }));
		app.use(cookieParser(config.session.secret));
		app.use(flash());
		app.use(passport.initialize());
		app.use(passport.session());
		app.use(rememberLogin.handle);
		app.use((req, res, next) => {
			app.locals = new Helper(req, res).object();
			next();
		});
		app.use(methodOverride('_method'));
		app.use(access.middleware());
	}

	setRoutes() {
		app.use(require('app/routes/web'));
	}
}

module.exports = Application;