const express = require('express');
const router = express.Router();

// Controller
const FakerController = require('app/http/controllers/faker/fakerController');

router.get('/room/:count', FakerController.room);
router.get('/comment/:count/:room', FakerController.comment);
router.get('/comment/:count/:room/:comment', FakerController.comment);

module.exports = router;