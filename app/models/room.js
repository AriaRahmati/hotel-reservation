const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Room = Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	slug: { type: String, default: '' },
	title: { type: String, required: true },
	type: { type: String, required: true },
	images: { type: Object, required: true },
	body: { type: String, required: true },
	price: { type: Number, required: true },
	maxPeople: { type: Number, required: true },
	reserved: { type: Boolean, default: false },
	viewCount: { type: Number, default: 0 },
	commentCount: { type: Number, default: 0 },
}, {
	timestamps: true,
	toJSON: {
		virtuals: true
	}
});

Room.methods.path = function () {
	return `/room/${this.slug}`;
}

Room.methods.inc = async function (field, number = 1) {
	this[field] += number;
	await this.save();
}

Room.virtual('comments', {
	ref: 'Comment',
	localField: '_id',
	foreignField: 'room'
});

Room.plugin(mongoosePaginate);

module.exports = mongoose.model('Room', Room);