const express = require('express');
const router = express.Router();

// Controller
const HomeController = require('app/http/controllers/homeController');
const RoomController = require('app/http/controllers/room/roomController');
const CommentController = require('app/http/controllers/comment/commentController');

// Middleware
const CheckUserAccess = require('app/http/middleware/checkUserAccess');

router.get('/', HomeController.index);

router.get('/logout', (req, res)=>{
	req.logOut();
	res.clearCookie('remember_token');
	res.redirect('/');
});

router.get('/room', RoomController.allRooms);
router.get('/room/:slug', RoomController.roomPage);
router.post('/room/payment', RoomController.payment);
// router.post('/room/payment/callback', RoomController.paymentCallback);

router.post('/comment', CommentController.comment);

module.exports = router;