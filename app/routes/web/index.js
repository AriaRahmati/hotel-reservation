const express = require('express');
const router = express.Router();

const homeRoutes = require('app/routes/web/home');
const authRoutes = require('app/routes/web/auth');
const adminRoutes = require('app/routes/web/admin');


// Middleware
const RedirectAuthenticated = require('app/http/middleware/redirectAuthenticated');
const RedirectNotAuthenticated = require('app/http/middleware/redirectNotAuthenticated');
const CheckError = require('app/http/middleware/checkError');

router.use('/', homeRoutes);
router.use('/auth', RedirectAuthenticated.handle, authRoutes);
router.use('/admin', RedirectNotAuthenticated.handle, adminRoutes);

router.all('*', CheckError.get404);
router.use(CheckError.handle);

module.exports = router;