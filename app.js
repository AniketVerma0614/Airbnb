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

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Initiate the database connection
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
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

// Root route
app.get("/", (req, res) => {
  res.send("Root is working!");
});




app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
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
