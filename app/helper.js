const autoBind = require('auto-bind');
const moment = require('moment-jalaali');
const path = require('path');

moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });

class Helper {
	constructor(req, res) {
		autoBind(this);
		this.req = req;
		this.res = res;
	}

	object() {
		return {
			auth: this.auth(),
			convertTime: this.convertTime,
			viewPath: this.viewPath,
			req: this.req,
			errorMessages: this.req.flash('errors'),
			successMessages: this.req.flash('success')
		}
	}

	auth() {
		return {
			check: this.req.isAuthenticated(),
			user: this.req.user
		}
	}

	convertTime(time) {
		return moment(time);
	}

	viewPath(dir) {
		return path.resolve(`${config.layout.VIEW_DIR}/${dir}`);
	}
}

module.exports = Helper;