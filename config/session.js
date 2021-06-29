const mongoStore = require('connect-mongo');

module.exports = {
	secret: 'secretId',
	resave: true,
	saveUninitialized: true,
	store: mongoStore.create({ mongoUrl: process.env.DATABASE_URL})
};