const Controller = require('app/http/controllers/controller');

const faker = require('faker');
const download = require('image-downloader');
const path = require('path');
const fs = require('fs');
const request = require('request-promise');
const sharp = require('sharp');

const Room = require('app/models/room');
const Comment = require('app/models/comment');

class FakerController extends Controller {
	async room(req, res, next) {
		const { count = 0 } = req.params;
		const loop = async () => {
			for (let i = 0; i < count; ++i) {
				const addRoom = new Room({
					user: req.user._id,
					title: faker.name.title(),
					type: (i % 2) ? 'normal' : 'vip',
					body: faker.lorem.text(),
					slug: faker.lorem.slug(),
					images: {
						'360': faker.image.imageUrl(360, 247, 'any', true),
						'720': faker.image.imageUrl(720, 494, 'any', true),
						'480': faker.image.imageUrl(480, 329, 'any', true),
						'1080': faker.image.imageUrl(1080, 741, 'any', true),
						'original': faker.image.imageUrl(2560, 1440, 'any', true)
					},
					price: faker.commerce.price(150000, 2000000),
					maxPeople: faker.datatype.number(6)
				});

				await addRoom.save();
			}
		}

		await loop();
		
		res.json(`${count} rooms added to database`);
	}

	async comment(req, res, next) {
		const { count = 0, room = null, comment = null } = req.params;
		if (!room) return res.json('invalid room');

		for (let i = 0; i < count; ++i) {
			const addComment = new Comment({
				user: req.user._id,
				room: room,
				parent: comment,
				comment: faker.lorem.text(),
				check: true,
			});

			await addComment.save();
		}

		res.json(`${count} comments added`)
	}
}

module.exports = new FakerController();