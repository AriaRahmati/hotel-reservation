const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
const randomString = require('randomstring');

const User = Schema({
	admin: { type: Boolean, default: false },
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
	payments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
	rememberToken: { type: String, default: '' }
}, {
	timestamps: true,
	toJSON: {
		virtuals: true
	}
});

User.pre('save', function (next) {
	const salt = bcrypt.genSaltSync(15);
	const hash = bcrypt.hashSync(this.password, salt);
	this.password = hash;

	next();
});

User.pre('findOneAndUpdate', function (next) {
	const { password } = this.getUpdate().$set;
	if (!password) return next();

	const salt = bcrypt.genSaltSync(15);
	const hash = bcrypt.hashSync(this.getUpdate().$set.password, salt);
	this.getUpdate().$set.password = hash;

	next();
});

User.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
}

User.methods.setRememberToken = function (response) {
	const token = randomString.generate(32);
	response.cookie('remember_token', token, { maxAge: 6 * 24 * 60 * 60 * 1000, httpOnly: true, signed: true })
	this.updateOne({ rememberToken: token });
}

User.methods.hasRoles = function (roles) {
	const result = roles.filter(role => this.roles.indexOf(role) > -1);
	return result.length;
}

User.virtual('rooms', {
	ref: 'Room',
	localField: '_id',
	foreignField: 'user'
});

User.virtual('comments', {
	ref: 'Comment',
	localField: '_id',
	foreignField: 'user'
});

User.plugin(mongoosePaginate);

module.exports = mongoose.model('User', User);