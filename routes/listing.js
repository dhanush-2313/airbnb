const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');


//index route
router.get("/", wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
}));

//NEW route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
})

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } });
    if (!listing) {
        req.flash('error', 'Listing you requested for does not exist!');
        res.redirect('/listings');
    }
    res.render("listings/show.ejs", { listing });
}));

//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    // let{title,description,image,price,location,country} = req.body;//long way
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success', 'Listing created successfully!');
    res.redirect(`/listings`);
}));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing you requested for does not exist!');
        res.redirect('/listings');
    }
    res.render("listings/edit.ejs", { listing });
}));

//update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('error', 'Listing deleted successfully!');
    res.redirect("/listings");
}));

module.exports = router;