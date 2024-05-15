const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const listingSchema = require('./schema.js')

const port = 3000;
const mongoUrl = 'mongodb://localhost:27017/wanderLust';

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.send('Root path');
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',')
        throw new ExpressError(errMsg, 400);
    } else {
        next();
    }
}


async function main() {
    await mongoose.connect(mongoUrl);
}


main().then(() => {
    console.log('Connected to DB');
}).catch((err) => {
    console.error(err);
});

app.get('/testListing', wrapAsync(async (req, res) => {
    let sampleListing = new Listing({
        title: "New Villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute, Goa",
        country: "India"
    });
    await sampleListing.save();
    res.send("successfull testing")
}))

//index route
app.get("/listings", wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
}));

//NEW route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

//create route
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    // let{title,description,image,price,location,country} = req.body;//long way
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect(`/listings`);
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "There was some error" } = err;
    res.status(status).render("listings/error.ejs", { err });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});