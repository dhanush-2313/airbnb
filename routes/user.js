const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');

router.get('/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/signup', wrapAsync(async (req, res, next) => {
    try {
        let { email, username, password } = req.body;
        let newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            } else {
                req.flash('success', 'Welcome to Wanderlust!');
                res.redirect('/listings');
            }
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }

}));



router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash('success', 'Welcome back to WanderLust!');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        } else {
            req.flash('success', 'Logged out successfully!');
            res.redirect('/listings');
        }
    })
});


module.exports = router;