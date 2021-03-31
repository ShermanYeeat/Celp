require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const vaccineCenter = require('./routes/vaccineCenter');
const reviews = require('./routes/reviews');


mongoose.connect('mongodb://localhost:27017/celp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

// Be able to render ejs files
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
// Set up default view path to views folder
app.set('views', path.join(__dirname, 'views'))

// Parse incoming requests as JSON
app.use(express.urlencoded({ extended: true }));
// Allow for PUT and DELETE requests in forms
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // Expires in 7 days
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
// All routes now have a method req.flash(key, value)
app.use(flash());
// Dont have to pass to templates .render(..., { variables })
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/vaccineCenters', vaccineCenter)
app.use('/vaccineCenters/:id/reviews', reviews)


// Render homepage
app.get('/', (req, res) => {
    res.render('home')
});

// If no route, throw Express Error and call next middleware
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// Middleware to render Error Page
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})


