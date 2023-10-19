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
router.route('/addDate/user').post(isAuthenticated, userController.addDate);
router.route('/getAllDates/user').get(isAuthenticated, userController.getAllDates);
router.route('/addLike/user').post(isAuthenticated, userController.addLike);
router.route('/getLikes/user').get(isAuthenticated, userController.getLikes);

module.exports = router;
