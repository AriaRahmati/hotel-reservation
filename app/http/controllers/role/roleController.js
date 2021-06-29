const Controller = require('app/http/controllers/controller');

const Permission = require('app/models/permission');
const Role = require('app/models/role');

class roleController extends Controller {
	async index(req, res, next) {
		const page = parseInt(req.query.page) || 1, limit = parseInt(req.query.limit) || 10;
		const roles = await Role.paginate({}, { page, limit, sort: { createdAt: -1 }, populate: ['permissions'] });
		res.render('admin/role', { roles: roles });
	}

	async create(req, res, next) {
		const permissions = await Permission.find({});
		res.render('admin/role/create', { permissions });
	}
	
	async store(req, res, next) {
		const result = await this.validationForm(req, res);
		if (result)
		this.storeProcess(req, res, next);
		else
		this.back(req, res);
	}
	
	async storeProcess(req, res, next) {
		const { title, body, permissions } = req.body;
		const newRole = new Role({
			title,
			body,
			permissions
		});

		await newRole.save();

		res.redirect('/admin/role');
	}

	async destroy(req, res, next) {
		const role = await Role.findById(req.params.id);
		if (!role) return res.json('چنین سطح دسترسی‌ای در سایت ثبت نشده است');

		await role.remove();

		res.redirect('/admin/role');
	}

	async edit(req, res, next) {
		const role = await Role.findById(req.params.id);
		const permissions = await Permission.find({});
		if (!role) return res.json('چنین سطح دسترسی‌ای در سایت ثبت نشده است');

		res.render('admin/role/edit', { role, permissions });
	}

	async update(req, res, next) {
		const result = await this.validationForm(req, res);
		if (result)
			this.updateProcess(req, res, next);
	}

	async updateProcess(req, res, next) {
		await Role.findByIdAndUpdate(req.params.id, { $set: { ...req.body } });
		req.flash('success', 'سطح دسترسی با موفقیت ویرایش شد')
		res.redirect('/admin/role');
	}
}

module.exports = new roleController();