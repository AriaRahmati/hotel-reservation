const Middleware = require("app/http/middleware/middleware");

const Permission = require('app/models/permission');

class CheckUserAccess extends Middleware {
	check(perm) {
		return async (req, res, next) => {
			const permissions = await Permission.find({ title: perm }).populate('roles');
			permissions.forEach(permission => {
				const roles = permission.roles.map(role => role._id);
				return req.user.hasRoles(roles) ? next() : res.redirect('/admin');
			});
		}
	}
}

module.exports = new CheckUserAccess();