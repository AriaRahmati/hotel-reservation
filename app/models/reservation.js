const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Reservation = Schema({
	room: { type: Schema.Types.ObjectId, ref: 'Room' },
	dateFrom: { type: String },
	dateTo: { type: String },
}, {
	timestamps: true
});

Reservation.plugin(mongoosePaginate);

module.exports = mongoose.model('Reservation', Reservation);