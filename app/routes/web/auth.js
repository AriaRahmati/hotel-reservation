const express = require('express');
const router = express.Router();
const passport = require('passport');

// Controller
const RegisterController = require('app/http/controllers/auth/registerController');
const LoginController = require('app/http/controllers/auth/loginController');
const ForgetPasswordController = require('app/http/controllers/auth/forgetPasswordController');
const ResetPasswordController = require('app/http/controllers/auth/resetPasswordController');

// Validator
const RegisterValidator = require('app/http/validators/registerValidator');
const LoginValidator = require('app/http/validators/loginValidator');
const ForgetPasswordValidator = require('app/http/validators/forgetPasswordValidator');
const ResetPasswordValidator = require('app/http/validators/resetPasswordValidator');

router.get('/register', RegisterController.showForm);
router.post('/register', RegisterValidator.handle(), RegisterController.registerProcess);

router.get('/login', LoginController.showForm);
router.post('/login', LoginValidator.handle(), LoginController.loginProcess);

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/auth/login' }));

router.get('/password/reset', ForgetPasswordController.showForm);
router.post('/password/email', ForgetPasswordValidator.handle(), ForgetPasswordController.resetLinkProcess);
router.get('/password/reset/:token', ResetPasswordController.showForm);
router.post('/password/reset', ResetPasswordValidator.handle(), ResetPasswordController.resetPasswordProcess);

module.exports = router;