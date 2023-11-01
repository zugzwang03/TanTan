const router = require('express').Router();
const adminController = require('../controllers/adminController.js');
const isAuthenticated = require("../middlewares/auth.js");

router.route('/login/admin').post(adminController.login);
router.route('/getUserRegistration/admin').get(isAuthenticated, adminController.getUserRegistration);
router.route('/editUserProfile/admin').post(isAuthenticated, adminController.editUserProfile);
router.route('/banUser/admin').post(isAuthenticated, adminController.banUser);
router.route('/verifyUser/admin').post(isAuthenticated, adminController.verifyUser);

module.exports = router;