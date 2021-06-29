const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Role = Schema({
	title: { type: String, required: true },
	body: { type: String, required: true },
	permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
}, {
	timestamps: true,
});

Role.plugin(mongoosePaginate);

module.exports = mongoose.model('Role', Role);