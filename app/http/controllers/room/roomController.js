const Controller = require('app/http/controllers/controller');

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const request = require('request-promise');
const randomString = require('randomstring');
const moment = require('moment-jalaali');

const Room = require('app/models/room');
const Payment = require('app/models/payment');
const User = require('app/models/user');
const Reservation = require('app/models/reservation');

class RoomController extends Controller {
	async index(req, res, next) {
		// const perPage = 10, page = req.query.page || 1;
		// await Room.find({}).skip((perPage * page) - perPage).limit(perPage).exec((err, rooms) => {
		// 	if (err) console.error(err);

		// 	Room.countDocuments().exec((err, count) => {
		// 		res.render('admin/room/index', {
		// 			rooms,
		// 			page,
		// 			pages: Math.ceil(count / perPage)
		// 		});
		// 	});
		// });

		const page = parseInt(req.query.page) || 1, limit = parseInt(req.query.limit) || 10;
		const rooms = await Room.paginate({}, { page, limit, sort: { createdAt: -1 } });
		res.render('admin/room', { rooms });
	}

	async roomPage(req, res, next) {
		const room = await Room.findOneAndUpdate({ slug: req.params.slug }, { $inc: { viewCount: 1 } }).populate([{
			path: 'user',
			select: 'name'
		}, {

			path: 'comments',
			match: {
				check: true,
				parent: null
			},
			populate: [{
				path: 'user',
				select: 'name'
			}, {
				path: 'comments',
				match: {
					check: true
				},
				populate: {
					path: 'user',
					select: 'name'
				}
			}]
		}, {
			path: 'reservations',
			select: ['dateFrom', 'dateTo']
		}]);

		if (!room) return res.json('چنین اتاقی در سیستم پیدا نشد');

		res.render('home/page/roomPage', { room });
	}

	async allRooms(req, res, next) {
		const page = parseInt(req.query.page) || 1, limit = parseInt(req.query.limit) || 15;

		let query = {};

		if (req.query.search)
			query.title = new RegExp(req.query.search, 'gi');
		if (req.query.type && req.query.type !== 'all')
			query.type = req.query.type

		const rooms = await Room.paginate({ ...query }, { page, limit, sort: { createdAt: parseInt(req.query.old) || -1 } });
		res.render('home/page/rooms', { rooms });
	}

	create(req, res, next) {
		res.render('admin/room/create');
	}

	async store(req, res, next) {
		const result = await this.validationForm(req, res);
		if (result)
			this.storeProcess(req, res, next);
		else
			if (req.file) fs.unlinkSync(req.file.path);
	}

	async storeProcess(req, res, next) {
		// const images = this.getImageDir(`${req.file.destination}/${req.file.originalname}`);
		const images = this.resizeImage(req.file);
		const { title, type, body, price, maxPeople } = req.body;
		const newRoom = new Room({
			user: req.user._id,
			slug: this.slug(title),
			title,
			type,
			images,
			body,
			price,
			maxPeople
		});

		await newRoom.save(err => {
			if (err) console.error(err);
		});

		req.flash('success', 'اتاق با موفقیت اضافه شد.');
		res.redirect('/admin/room');
	}

	slug(title) {
		return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, '-')
	}

	getImageDir(dir) {
		return dir.substring(8);
	}

	async destroy(req, res, next) {
		const room = await Room.findById(req.params.id).populate([{ path: 'comments' }]);
		if (!room) return res.json('چنین اتاقی در سایت ثبت نشده است');

		room.comments.forEach(async comment => await comment.remove());

		try {
			Object.values(room.images).forEach(image => fs.unlinkSync(`./public/${image}`));
		} catch { }

		await room.remove();

		req.flash('success', 'اتاق با موفقیت حذف شد.');
		this.back(req, res);
	}

	async edit(req, res, next) {
		const room = await Room.findById(req.params.id);
		if (!room) return res.json('چنین اتاقی در سایت ثبت نشده است');

		res.render('admin/room/edit', { room });
	}

	async update(req, res, next) {
		const result = await this.validationForm(req, res);
		if (result)
			this.updateProcess(req, res, next);
		else
			if (req.file) fs.unlinkSync(req.file.path);
	}

	async updateProcess(req, res, next) {
		let imageUrl = {};
		if (req.file)
			// req.body.images = this.getImageDir(`${req.file.destination}/${req.file.originalname}`);
			imageUrl.images = this.resizeImage(req.file);
		// else
		delete req.body.images;

		await Room.findByIdAndUpdate(req.params.id, { $set: { ...req.body, ...imageUrl } });
		req.flash('success', 'اتاق با موفقیت ویرایش شد.');
		res.redirect('/admin/room');
	}

	getOptions(url, params) {
		return {
			method: 'POST',
			url: url,
			headers: {
				'cache-control': 'no-cache',
				'content-type': 'application/json'
			},
			body: params,
			json: true
		};
	}

	async payment(req, res, next) {
		const userDateFrom = req.body.date_from || '', userDateTo = req.body.date_to || '';

		const room = await Room.findById(req.body.room).populate('reservations');
		if (!room)
			return res.json('چنین اتاقی در سایت ثبت نشده است');

		if (!userDateFrom || !userDateTo) {
			req.flash('errors', 'تاریخ ورود و خروج خود را مشخص کنید.');
			return res.redirect(room.path());
		}

		let alreadyReserved;
		room.reservations.forEach(reservation => {
			let { dateFrom, dateTo } = reservation;
			dateFrom = moment(dateFrom).startOf('jDay');
			dateTo = moment(dateTo).endOf('jDay');
			const userDateFromAccess = moment(userDateFrom).startOf('jDay').isBetween(dateFrom, dateTo);
			const userDateToAccess = moment(userDateTo).endOf('jDay').isBetween(dateFrom, dateTo);
			const possibleDateFromAccess = moment(dateFrom).startOf('jDay').isBetween(userDateFrom, userDateTo);
			const possibleDateToAccess = moment(dateTo).endOf('jDay').isBetween(userDateFrom, userDateTo);
			if (userDateFromAccess || userDateToAccess || possibleDateFromAccess || possibleDateToAccess)
				alreadyReserved = { dateFrom, dateTo };
		});

		if (alreadyReserved) {
			console.log(alreadyReserved);
			req.flash('errors', `این اتاق در بازه‌ی ${alreadyReserved.dateFrom.format('jD jMMMM jYYYY ساعت HH:mm:ss')} تا ${alreadyReserved.dateTo.format('jD jMMMM jYYYY ساعت HH:mm:ss')} رزرو می‌باشد.`);
			return res.redirect(room.path());
		}

		const user = await User.findById(req.user._id);
		if (!user)
			return res.json('چنین کاربری در سایت ثبت نام نکرده است');

		const addReservation = new Reservation({
			room: room._id,
			dateFrom: userDateFrom,
			dateTo: userDateTo
		});

		const addPayment = new Payment({
			user: user._id,
			reservation: addReservation._id,
			authority: randomString.generate(32),
			price: room.price
		});

		room.reservations.push(addReservation);

		await addReservation.save();
		await addPayment.save();
		await room.save();
		await user.updateOne({ $push: { payments: addPayment._id } });

		req.flash('success', [
			'رزرو اتاق با موفقیت انجام شد.',
			`کد پیگیری:‌ ${addPayment.authority}`,
			`تاریخ ورود:‌ ${moment(userDateFrom).startOf('jDay').format('jD jMMMM jYYYY ساعت HH:mm:ss')}`,
			`تاریخ خروج:‌ ${moment(userDateTo).endOf('jDay').format('jD jMMMM jYYYY ساعت HH:mm:ss')}`,
			'جزییات رزرواسیون خود را می‌توانید از بخش پروفایل خود مشاهده کنید.'
		]);
		res.redirect(room.path());
	}

	async _payment(req, res, next) {
		const room = await Room.findById(req.body.room);
		if (!room)
			return res.json('چنین اتاقی در سایت ثبت نشده است');

		if (room.reserved) {
			req.flash('errors', 'این اتاق ثبلا رزرو شده است');
			return res.redirect(room.path());
		}

		const params = {
			MerchantID: config.service.ZARINPAL.MerchantID,
			Amount: room.price,
			CallbackURL: 'http://localhost:3000/room/payment/callback',
			Description: `رزرو اتاق ${room.title}`,
			Email: req.user.email,
		};

		request(this.getOptions('https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json', params))
			.then(async response => {
				const addPayment = new Payment({
					user: req.user._id,
					room: room._id,
					authority: response.Authority,
					price: room.price
				});

				await addPayment.save();
				// res.json(response, addPayment);
				res.redirect(`https://www.zarinpal.com/pg/StartPay/${response.Authority}`);
			})
			.catch(error => res.json(error.message));
	}

	async _paymentCallback(req, res, next) {
		const payment = await Payment.findOne({ authority: req.query.authority }).populate(['room', 'user']);
		console.log(payment)
		if (!payment.room)
			return res.json('اتاق مورد نظر پیدا نشد');

		if (req.query.Status && req.query.Status != 'OK')
			return res.json('پرداخت با مشکل مواجه شد');

		const params = {
			MerchantID: config.service.ZARINPAL.MerchantID,
			Amount: payment.price,
			Authority: req.query.Authority
		};

		request(this.getOptions('https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json', params))
			.then(async response => {
				if (response.Statuc == 100) {
					payment.set({ payment: true });
					payment.room.set({ reserved: true });
					payment.user.payments.push(payment.room._id);

					await payment.save();
					await payment.room.save();
					await payment.user.save();
					res.redirect(payment.room.path());
				} else {
					return res.json('پرداخت ناموفق');
				}
			})
			.catch(error => res.json(error.message));
	}

	resizeImage(image) {
		const imagePath = path.parse(image.path);
		let imageUrl = {};
		imageUrl.original = this.getImageDir(`${image.destination}/${image.filename}`)

		const resize = size => {
			const imageName = `${imagePath.name}-${size}${imagePath.ext}`;
			imageUrl[size] = this.getImageDir(`${image.destination}/${imageName}`);

			sharp(image.path)
				.resize(size, null)
				.toFile(`${image.destination}/${imageName}`)
		}

		[1080, 720, 480, 360].map(resize);

		return imageUrl;
	}
}

module.exports = new RoomController();