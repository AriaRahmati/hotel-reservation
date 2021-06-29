const Controller = require('app/http/controllers/controller');

const Permission = require('app/models/permission');

class PermissionController extends Controller {
	async index(req, res, next) {
		const page = parseInt(req.query.page) || 1, limit = parseInt(req.query.limit) || 10;
		const permissions = await Permission.paginate({}, { page, limit, sort: { createdAt: -1 } });
		res.render('admin/permission', { permissions });
	}

	create(req, res, next) {
		res.render('admin/permission/create');
	}

	async store(req, res, next) {
		const result = await this.validationForm(req, res);
		if (result)
			this.storeProcess(req, res, next);
	}

	async storeProcess(req, res, next) {
		const { title, body } = req.body;
		const newPermission = new Permission({
			title,
			body
		});

		await newPermission.save();

		res.redirect('/admin/permission');
	}

	async destroy(req, res, next) {
		const permission = await Permission.findById(req.params.id);
		if (!permission) return res.json('چنین دسترسی‌ای در سایت ثبت نشده است');

		await permission.remove();

		res.redirect('/admin/permission');
	}

	async edit(req, res, next) {
		const permission = await Permission.findById(req.params.id);
		if (!permission) return res.json('چنین دسترسی‌ای در سایت ثبت نشده است');

		res.render('admin/permission/edit', { permission });
	}

	async update(req, res, next) {
		const result = await this.validationForm(req, res);
		if (result)
			this.updateProcess(req, res, next);
	}

	async updateProcess(req, res, next) {
		await Permission.findByIdAndUpdate(req.params.id, { $set: { ...req.body } });
		req.flash('success', 'دسترسی با موفقیت ویرایش شد')
		res.redirect('/admin/permission');
	}
}

module.exports = new PermissionController();