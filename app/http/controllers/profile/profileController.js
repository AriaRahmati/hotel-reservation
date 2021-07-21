const Controller = require('app/http/controllers/controller');

const User = require('app/models/user');
const Payment = require('app/models/payment');

class ProfileController extends Controller {
	async index(req, res) {
		const profile = await User.findById(req.user.id).populate([
			'rooms',
			'comments',
			{
				path: 'payments',
				populate: {
					path: 'reservation',
					populate: 'room'
				}
			}]);
		res.render('admin/profile', { profile });
	}

	async updateProfile(req, res, next) {
		req.body.email = req.user.email;
		// const result = await this.validationForm(req, res);
		// if (result)
		this.updateProfileProcess(req, res, next);
	}

	async updateProfileProcess(req, res, next) {
		if (!req.body.password)
			delete req.body.password;

		await User.findByIdAndUpdate(req.params.id, { $set: { ...req.body } });
		req.flash('success', 'اطلاعات حساب کاربری با موفقیت ویرایش شد.');
		this.back(req, res);
	}

	async cancelReserve(req, res, next) {
		const payment = await Payment.findById(req.params.paymentId).populate({
			path: 'reservation',
			populate: {
				path: 'room',
				select: 'reservations'
			}
		});

		await payment.set({ canceledByUser: true });
		const { reservations } = payment.reservation.room;

		const index = reservations.indexOf(payment.reservation._id);
		if (index != -1)
			reservations.splice(index, 1);


		await payment.reservation.room.save();
		await payment.save();

		req.flash('success', 'اتاق رزروی شما با موفقیت لغو شد.');
		this.back(req, res);
	}
}

module.exports = new ProfileController();