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
router.route('/setAvailableTime/user').post(isAuthenticated, userController.setAvailableTime);
router.route('/askToDate/user').post(isAuthenticated, userController.askToDate);
router.route('/addDateReview/user').post(isAuthenticated, userController.addDateReview);
router.route('/getPastDates/user').get(isAuthenticated, userController.getPastDates);
router.route('/earnGems/user').post(isAuthenticated, userController.earnGems);
router.route('/spendGems/user').post(isAuthenticated, userController.spendGems);
router.route('/purchaseMembershipsByGems/user').post(isAuthenticated, userController.purchaseMembershipsByGems);
router.route('/getPotentialDates/user').get(isAuthenticated, userController.getPotentialDates);
router.route('/readFeedback/user').get(isAuthenticated, userController.readFeedback);

module.exports = router;