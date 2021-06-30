const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Permission = Schema({
	title: { type: String, required: true },
	body: { type: String, required: true }
}, {
	timestamps: true,
	toJSON: {
		virtuals: true
	}
});

Permission.virtual('roles', {
	ref: 'Role',
	localField: '_id',
	foreignField: 'permissions'
});

Permission.plugin(mongoosePaginate);

module.exports = mongoose.model('Permission', Permission);