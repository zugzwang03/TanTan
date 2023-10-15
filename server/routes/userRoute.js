const router = require('express').Router();
const userController = require('../controllers/userController.js');
const isAuthenticated = require("../middlewares/auth.js");

router.route('/login/user').post(userController.login);
router.route('/profileOverview/user').post(isAuthenticated, userController.profileOverview);
router.route('/appearances/user').post(isAuthenticated, userController.appearances);
router.route('/aboutMe/user').post(isAuthenticated, userController.aboutMe);
router.route('/datingPreferences/user').post(isAuthenticated, userController.datingPreferences);
router.route('/personalInfo/user').post(isAuthenticated, userController.personalInfo);
router.route('/locationServices/user').post(isAuthenticated, userController.locationServices);
router.route('/likeToDate/user').post(isAuthenticated, userController.likeToDate);
router.route('/editProfile/user').post(isAuthenticated, userController.editProfile);

module.exports = router;
