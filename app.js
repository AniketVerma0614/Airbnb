//app.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

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
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// Root route
app.get("/", (req, res) => {
  res.send("Root is working!");
});

// Index Route
app.get("/listings", wrapAsync(async(req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching listings.");
  }
}));

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route

/*
app.get("/listings/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, `Invalid ID: "${id}" is not a valid MongoDB ObjectId`);
    }

    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    
    res.render("listings/show.ejs", { listing });
}));
*/
app.get("/listings/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, `Invalid ID: "${id}" is not a valid MongoDB ObjectId`);
    }

    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    
    res.render("listings/show.ejs", { listing });
}));


// Create Route
app.post(
    "/listings",
    wrapAsync(async (req, res,next) => {
      if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listings");
      }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
  })
);

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async(req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("listings/edit.ejs", { listing });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching the listing for editing.");
  }
}));

// Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  try {
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating the listing.");
  }
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async(req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));  
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong !!!"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

// Start the server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
