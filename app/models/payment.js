const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Payment = Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	room: { type: Schema.Types.ObjectId, ref: 'Room', default: null },
	authority: { type: String, required: true },
	price: { type: Number, required: true },
	payment: { type: Boolean, default: false }
}, {
	timestamps: true,
});

Payment.plugin(mongoosePaginate);

module.exports = mongoose.model('Payment', Payment);