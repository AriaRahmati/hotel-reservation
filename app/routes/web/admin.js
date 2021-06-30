const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('app/uploadImages');

router.use((req, res, next) => {
	res.locals.layout = 'admin/master';
	next();
});

// Controller
const AdminController = require('app/http/controllers/adminController');
const RoomController = require('app/http/controllers/room/roomController');
const CommentController = require('app/http/controllers/comment/commentController');
const ProfileController = require('app/http/controllers/profile/profileController');
const PermissionController = require('app/http/controllers/permission/permissionController');
const RoleController = require('app/http/controllers/role/roleController');
const UserController = require('app/http/controllers/user/userController');

// Validator
const RoomValidator = require('app/http/validators/roomValidator');
const RegisterValidator = require('app/http/validators/registerValidator');
const PermissionValidator = require('app/http/validators/permissionValidator');
const RoleValidator = require('app/http/validators/roleValidator');

// Middleware
const FileToField = require('app/http/middleware/fileToField');
const CheckUserAccess = require('app/http/middleware/checkUserAccess');

router.get('/', AdminController.index);

router.get('/room', CheckUserAccess.can('room'), RoomController.index);
router.get('/room/create', CheckUserAccess.can('room'), RoomController.create);
router.post('/room/create', CheckUserAccess.can('room'), upload.single('images'), FileToField.handle, RoomValidator.handle(), RoomController.store);
router.delete('/room/:id', CheckUserAccess.can('room'), RoomController.destroy);
router.get('/room/edit/:id', CheckUserAccess.can('room'), RoomController.edit);
router.put('/room/edit/:id', CheckUserAccess.can('room'), upload.single('images'), FileToField.handle, RoomValidator.handle(), RoomController.update);

router.get('/comment', CheckUserAccess.can('comment'), CommentController.index);
router.delete('/comment/:id', CheckUserAccess.can('comment'), CommentController.destroy);
router.put('/comment/:id', CheckUserAccess.can('comment'), CommentController.verify);

router.get('/profile', ProfileController.index);
router.put('/profile/:id', RegisterValidator.handle(), ProfileController.updateProfile);
router.delete('/profile/:reserveId', ProfileController.cancelReserve);

router.get('/permission', CheckUserAccess.can('permission'), PermissionController.index);
router.get('/permission/create', CheckUserAccess.can('permission'), PermissionController.create);
router.post('/permission/create', CheckUserAccess.can('permission'), PermissionValidator.handle(), PermissionController.store);
router.delete('/permission/:id', CheckUserAccess.can('permission'), PermissionController.destroy);
router.get('/permission/edit/:id', CheckUserAccess.can('permission'), PermissionController.edit);
router.put('/permission/edit/:id', CheckUserAccess.can('permission'), PermissionValidator.handle(), PermissionController.update);

router.get('/role', CheckUserAccess.can('role'), RoleController.index);
router.get('/role/create', CheckUserAccess.can('role'), RoleController.create);
router.post('/role/create', CheckUserAccess.can('role'), RoleValidator.handle(), RoleController.store);
router.delete('/role/:id', CheckUserAccess.can('role'), RoleController.destroy);
router.get('/role/edit/:id', CheckUserAccess.can('role'), RoleController.edit);
router.put('/role/edit/:id', CheckUserAccess.can('role'), RoleValidator.handle(), RoleController.update);

router.get('/user', CheckUserAccess.can('user'), UserController.index);
router.get('/user/create', CheckUserAccess.can('user'), UserController.create);
router.post('/user/create', CheckUserAccess.can('user'), RegisterValidator.handle(), UserController.store);
router.delete('/user/:id', CheckUserAccess.can('user'), UserController.destroy);
router.get('/user/edit/:id', CheckUserAccess.can('user'), UserController.edit);
router.put('/user/edit/:id', CheckUserAccess.can('user'), RegisterValidator.handle(), UserController.update);
router.get('/user/roles/:id', CheckUserAccess.can('user'), UserController.roles);
router.put('/user/roles/:id', CheckUserAccess.can('user'), UserController.addRoles);
router.get('/user/reserves/:id', CheckUserAccess.can('user'), UserController.reserves);
router.delete('/user/reserves/:userId/:paymentId', CheckUserAccess.can('user'), UserController.cancelReserve);
router.get('/user/make-admin/:id', CheckUserAccess.can('user'), UserController.makeAdmin);

module.exports = router;