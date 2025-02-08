const path = require("path");
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Session Configuration
const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 1-day session duration
};

app.use(session(sessionOptions));
app.use(flash());

// ===> Custom Middleware to Store Flash Messages and User Data in res.locals <===
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.name = req.session.name || "Guest";
    next();
});

// ===> Middleware for User Registration <===
const registerUser = (req, res, next) => {
    let { name } = req.query;

    if (!name) {
        req.flash("error", "User not registered!");
        return res.redirect("/hello");
    }

    req.session.name = name;
    req.flash("success", "User registered successfully!");
    next();
};

// Route to Handle Registration (Now Uses Middleware)
app.get("/register", registerUser, (req, res) => {
    res.redirect("/hello");
});

// Hello Route (Now Uses res.locals)
app.get("/hello", (req, res) => {
    res.render("page.ejs");
});

// Start the Server
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});






/*
Now, when a user registers via /register?name=John, they will be redirected to /hello and see:

User registered successfully!
Hello, John
*/