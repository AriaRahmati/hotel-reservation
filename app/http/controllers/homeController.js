const Room = require('app/models/room');

class HomeController {
	async index(req, res) {
		const rooms = await Room.find({}).sort({ createdAt: 1 }).limit(6);
		res.render('index', { rooms });
	}
}

module.exports = new HomeController();