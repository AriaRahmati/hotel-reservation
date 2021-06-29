const Controller = require('app/http/controllers/controller');

const Comment = require('app/models/comment');

class CommentController extends Controller {
	async index(req, res, next) {
		const page = parseInt(req.query.page) || 1, limit = parseInt(req.query.limit) || 25;
		const comments = await Comment.paginate({}, {
			page, limit, sort: { createdAt: -1 }, populate: [{
				path: 'user', select: 'name'
			}, {
				path: 'room'
			}]
		});

		res.render('admin/comment', { comments });
	}

	async comment(req, res, next) {
		const addComment = new Comment({
			user: req.user._id,
			...req.body
		});

		addComment.check = false;
		await addComment.save();
		return this.back(req, res);
	}

	async destroy(req, res, next) {
		const comment = await Comment.findById(req.params.id).populate(['comments', 'autoSection']);
		if (!comment) return res.json('چنین دیدگاهی وجود ندارد');

		let count = comment.comments.length + 1;

		comment.comments.forEach(async comment => await comment.remove());

		await comment.autoSection.inc('commentCount', -count);

		await comment.remove();
		res.redirect('/admin/comment');
	}

	async verify(req, res, next) {
		const comment = await Comment.findById(req.params.id).populate('autoSection');
		if (!comment) return res.json('چنین دیدگاهی وجود ندارد');

		comment.check = true;
		await comment.autoSection.inc('commentCount');

		await comment.save();

		res.redirect('/admin/comment');
	}
}

module.exports = new CommentController();