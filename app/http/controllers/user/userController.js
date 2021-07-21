const Controller = require('app/http/controllers/controller');

const User = require('app/models/user');
const Role = require('app/models/role');
const Payment = require('app/models/payment');
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

		req.flash('success', 'کاربر با موفقیت اضافه شد.');
		res.redirect('/admin/user');
	}

	async destroy(req, res, next) {
		const user = await User.findById(req.params.id);
		if (!user) return res.json('چنین کاربری در سایت ثبت نشده است');

		await user.remove();

		req.flash('success', 'کاربر با موفقیت حذف شد.');
		this.back(req, res);
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

		req.flash('success', 'کاربر با موفقیت ویرایش شد.');
		res.redirect('/admin/user');
	}

	async roles(req, res, next) {
		const user = await User.findById(req.params.id).populate('roles');
		const roles = await Role.find({});
		res.render('admin/user/userRoles', { user, roles });
	}

	async addRoles(req, res, next) {
		await User.findByIdAndUpdate(req.params.id, { $set: { roles: req.body.roles || [] } });

		req.flash('success', 'سطوح دسترسی کاربر با موفقیت ویرایش شد.');
		res.redirect('/admin/user');
	}

	async reserves(req, res, next) {
		const users = await User.find({}, { name: 1, email: 1 }).populate({
			path: 'payments',
			populate: {
				path: 'reservation',
				populate: 'room'
			}
		});

		res.render('admin/user/reserves', { users });
	}

	async userReserves(req, res, next) {
		const user = await User.findById(req.params.id).populate({
			path: 'payments',
			populate: {
				path: 'reservation',
				populate: 'room'
			}
		});

		res.render('admin/user/userReserves', { user });
	}

	async cancelReserve(req, res, next) {
		const payment = await Payment.findById(req.params.paymentId).populate({
			path: 'reservation',
			populate: {
				path: 'room',
				select: 'reservations'
			}
		});

		await payment.set({ canceledByAdmin: true });
		const { reservations } = payment.reservation.room;

		const index = reservations.indexOf(payment.reservation._id);
		if (index != -1)
			reservations.splice(index, 1);


		await payment.reservation.room.save();
		await payment.save();

		req.flash('success', 'اتاق رزروی کاربر با موفقیت لغو شد.');
		this.back(req, res);
	}

	async makeAdmin(req, res, next) {
		const user = await User.findById(req.params.id);
		await user.updateOne({ $set: { admin: !user.admin } });

		req.flash('success', user.admin ? 'مدیریت کاربر با موفقیت حذف شد.' : 'کاربر با موفقیت مدیر شد.');
		this.back(req, res);
	}
}

module.exports = new UserController();