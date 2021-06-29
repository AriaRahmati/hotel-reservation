const ConnectRoles = require('connect-roles');

const Permission = require('app/models/permission');

const user = new ConnectRoles({
	failureHandler: function (req, res, action) {
		const accept = req.headers.accept || '';
		res.status(403);
		if (~accept.indexOf('html')) {
			res.render('layouts/error', { action, statusCode: res.statusCode, message: 'شما سعی کردید به صفحه‌ای دسترسی پیدا کنید که برای آن احراز هویت قبلی نداشته‌اید' });
		} else {
			res.send('Access Denied - You don\'t have permission to: ' + action);
		}
	}

});

const permissions = async () => {
	return await Permission.find({}).populate('roles');
}

permissions()
	.then(permissions => {
		permissions.forEach(permission => {
			const roles = permission.roles.map(role => role._id);
			user.use(permission.title, req => {
				return req.user.hasRoles(roles) ? true : false;
			});
		});
	});

module.exports = user;