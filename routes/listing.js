const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const listingController = require('../controllers/listings');
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });
const fs = require('fs');
const path = require('path');

router.get('/favicon.ico', (req, res) => {
    const faviconPath = path.join(__dirname, 'public', 'favicon.ico');

    fs.access(faviconPath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(204).end();
        } else {
            res.sendFile(faviconPath);
        }
    });
});


//index and create routes
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));

//NEW route
router.get("/new", isLoggedIn, (listingController.renderNewForm));

//show, update, and delete routes
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;