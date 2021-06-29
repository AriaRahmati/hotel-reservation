const Controller = require('app/http/controllers/controller');

const User = require('app/models/user');
const Room = require('app/models/room');
const Role = require('app/models/role');

class UserController extends Controller {
	async index(req, res, next) {
		const page = parseInt(req.query.page) || 1, limit = parseInt(req.query.limit) || 10;
		const users = await User.paginate({}, { page, limit, sort: { createdAt: -1 }, populate: ['roles'] });
		res.render('admin/user', { users: users });
	}

	create(req, res, next) {
		res.render('admin/user/create');
	}

	async store(req, res, next) {
		const result = await this.validationForm(req, res);
		if (result)
			this.storeProcess(req, res, next);
	}

	async storeProcess(req, res, next) {
		const { name, email, password } = req.body;
		const newUser = new User({
			name,
			email,
			password
		});

		await newUser.save();

		res.redirect('/admin/user');
	}

	async destroy(req, res, next) {
		const user = await User.findById(req.params.id);
		if (!user) return res.json('چنین کاربری در سایت ثبت نشده است');

		await user.remove();

		res.redirect('/admin/user');
	}

	async edit(req, res, next) {
		const user = await User.findById(req.params.id);
		if (!user) return res.json('چنین کاربری در سایت ثبت نشده است');

		res.render('admin/user/edit', { user });
	}

	async update(req, res, next) {
		const result = await this.validationForm(req, res);
		if (result)
			this.updateProcess(req, res, next);
	}

	async updateProcess(req, res, next) {
		if (!req.body.password)
			delete req.body.password;

		await User.findByIdAndUpdate(req.params.id, { $set: { ...req.body } });

		req.flash('success', 'کاربر با موفقیت ویرایش شد')
		res.redirect('/admin/user');
	}

	async roles(req, res, next) {
		const user = await User.findById(req.params.id).populate('roles');
		const roles = await Role.find({});
		res.render('admin/user/userRoles', { user, roles });
	}

	async addRoles(req, res, next) {
		await User.findByIdAndUpdate(req.params.id, { $set: { roles: req.body.roles || [] } });

		req.flash('success', 'سطوح دسترسی کاربر با موفقیت ویرایش شد');
		res.redirect('/admin/user');
	}

	async reserves(req, res, next) {
		const user = await User.findById(req.params.id).populate('reservedRooms');
		res.render('admin/user/userReserves', { user });
	}

	async deleteReserve(req, res, next) {
		const user = await User.findById(req.params.userId).populate('reservedRooms');
		await user.updateOne({ $pull: { reservedRooms: req.params.reserveId } });
		await Room.findByIdAndUpdate(req.params.reserveId, { $set: { reserved: false } });

		req.flash('success', 'اتاق رزروی کاربر با موفقیت حذف شد');
		res.redirect(`/admin/user/reserves/${user._id}`);
	}

	async makeAdmin(req, res, next) {
		const user = await User.findById(req.params.id);
		await user.updateOne({ $set: { admin: !user.admin } });

		res.redirect('/admin/user');
	}
}

module.exports = new UserController();