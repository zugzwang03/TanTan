const router = require('express').Router();
const login = require('../controllers/userController.js');
const profileOverview = require("../controllers/userController.js");
const isAuthenticated = require("../middlewares/auth.js");

router.route('/login/user').post(login);
router.route('/profileOverview/user').post(isAuthenticated, profileOverview);

module.exports = router;