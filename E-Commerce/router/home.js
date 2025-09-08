const express = require("express")
const router = express.Router()
const homeController = require('../controller/home')
const passport = require('passport')

router.get('/', homeController.getHome)
router.get('/login', homeController.getLogin)
router.get('/signup', homeController.getSignup)

router.get("/logout", function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect("/login");
	});
});

// Google Authentication
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.post(
	"/login",
	passport.authenticate("local", { failureRedirect: "/login" }),
	function (req, res) {
		console.log("Login Success: ", req.user);
		res.redirect("/");
	}
);
router.post('/signup', homeController.postSignup)

module.exports = router;