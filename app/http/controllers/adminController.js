const Controller = require('app/http/controllers/controller');

const User = require('app/models/user');

class AdminController extends Controller {
	async index(req, res) {
		// const user = await User.findById(req.user._id).populate('rooms').exec();
		// const user = await User.findById(req.user._id).populate('rooms');
		// res.render('admin');
		res.redirect('/admin/profile');
	}
}

module.exports = new AdminController();