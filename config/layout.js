const path = require('path');
const expressLayout = require('express-ejs-layouts');

module.exports = {
	PUBLIC_DIR: './public',
	VIEW_ENGINE: 'ejs',
	VIEW_DIR: path.resolve('./resource/views'),
	EJS: {
		expressLayout,
		master: 'master',
		extractScripts: true,
		extractStyles: true
	}
};