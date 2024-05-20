const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');
const mongoUrl = 'mongodb://localhost:27017/wanderLust';
const session = require('express-session');
const flash = require('connect-flash');

const port = 3000;
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

const sessionOptions = {
    secret: 'mysupersecretcode',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.get('/', (req, res) => {
    res.redirect('/listings');
});

app.use(session(sessionOptions));   // Session middleware
app.use(flash());   // Flash middleware

async function main() {
    await mongoose.connect(mongoUrl);
}

main().then(() => {
    console.log('Connected to DB');
}).catch((err) => {
    console.error(err);
});

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.deletee = req.flash('deletee');
    next();
});

app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);

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