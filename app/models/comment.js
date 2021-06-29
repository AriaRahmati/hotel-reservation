const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Comment = Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	room: { type: Schema.Types.ObjectId, ref: 'Room', default: undefined },
	comment: { type: String, required: true },
	check: { type: Boolean, default: false },
	parent: { type: Schema.Types.ObjectId, ref: 'Comment', default: null }
}, {
	timestamps: true,
	toJSON: {
		virtuals: true
	}
});

Comment.virtual('comments', {
	ref: 'Comment',
	localField: '_id',
	foreignField: 'parent'
});

Comment.virtual('autoSection', {
	ref: doc => {
		if (doc.room)
			return 'Room'
	},
	localField: doc => {
		if (doc.room)
			return 'room'
	}, 
	foreignField: '_id',
	justOne: true
});

Comment.plugin(mongoosePaginate);

module.exports = mongoose.model('Comment', Comment);