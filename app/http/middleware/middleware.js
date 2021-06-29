const autoBind = require('auto-bind');

class Middleware {
	constructor() {
		autoBind(this);
	}
}

module.exports = Middleware;