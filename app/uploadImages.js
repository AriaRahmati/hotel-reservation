const multer = require('multer');
const fs = require('fs');
const mkdirp = require('mkdirp');

const getDir = () => {
	const year = new Date().getFullYear();
	const month = new Date().getMonth();
	const date = new Date().getDate();

	return `./public/uploads/images/${year}/${month}/${date}`;
}

const storageImage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = getDir();
		mkdirp.sync(dir);
		cb(null, dir);
	},
	filename: (req, file, cb) => {
		const filePath = `${getDir()}/${file.originalname}`;
		if (!fs.existsSync(filePath))
			cb(null, file.originalname);
		else
			cb(null, `${Date.now()}-${file.originalname}`);
	}
});

const uploadImage = multer({
	storage: storageImage,
	limits: {
		fileSize: 1024 * 1024 * 5 // 5MB
	}
});

module.exports = uploadImage;