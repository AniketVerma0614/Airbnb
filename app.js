if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log("ATLASDB_URL:", process.env.ATLASDB_URL || "NOT SET");
console.log("SECRET:", process.env.SECRET || "NOT SET");
console.log("MAP_TOKEN:", process.env.MAP_TOKEN || "NOT SET");



//app.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema ,reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl   = process.env.ATLASDB_URL;

// Initiate the database connection
async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to DB!");
  } catch (err) {
    console.error("Connection error:", err);
  }
}
main();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// use ejs-locals for all ejs templates:
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24* 3600,
});


store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});


const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 *24*60*60*1000,
    maxAge: 7 *24*60*60*1000,
    httpOnly: true,
  }
};

// // Root route
// app.get("/", (req, res) => {
//   res.send("Root is working!");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Add this middleware after passport configuration:
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  // Make sure 'search' is always defined, defaulting to an empty string
  res.locals.search = req.query.search || '';
  next();
});
// Root route to redirect first-time accesses:
app.get("/", (req, res) => {
  if (!req.user) {
    return res.redirect("/signup");
  }
  res.redirect("/listings");
});

// app.get("/demouser",async (req,res)=>{
//     let fakeUser = new User({
//       email: "student@gmail.com",
//       username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong !!!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // Alternatively, you could use: res.status(statusCode).send(message);
});

// Start the server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
