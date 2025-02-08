//listings.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");




// Minimal change: Move the req.body.listing check into the validation middleware.
const validateListing = (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listings");
    }
    let { error } = listingSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(400, msg);
    }
    else{
      next();
    }
  };




// Index Route
router.get(
    "/",
    wrapAsync(async (req, res) => {
      try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
      } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching listings.");
      }
    })
  );
  
  // New Route
  router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    // Validate the ObjectId first:
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", `Invalid ID: "${id}" is not a valid MongoDB ObjectId`);
      return res.redirect("/listings");
    }

    const listing = await Listing.findById(id).populate("reviews");

    // If no listing is found, flash an error and redirect to the main listings page:
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }

    // Otherwise, render the show page:
    res.render("listings/show.ejs", { listing });
  })
);

  
  
  // Create Route
  router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res, next) => {
      // With the check moved into validateListing, this is no longer needed:
      // if (!req.body.listing) {
      //   throw new ExpressError(400, "Send valid data for listings");
      // }
      const newListing = new Listing(req.body.listing);
      await newListing.save();
      req.flash("success","New Listing Created!");
      res.redirect("/listings");
    })
  );
  
// Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    // Validate the ObjectId first
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", `Invalid ID: "${id}" is not a valid MongoDB ObjectId`);
      return res.redirect("/listings");
    }

    const listing = await Listing.findById(id);

    // If listing doesn't exist, flash an error and redirect
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }

    // Otherwise, render the edit page
    res.render("listings/edit.ejs", { listing });
  })
);

  
// Update Route
router.put(
    "/:id",
    validateListing,
    wrapAsync(async (req, res) => {
      const { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      req.flash("success","Listing Updated !");
      res.redirect(`/listings/${id}`);
    })
  );
  
  
  // Delete Route
  router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      req.flash("success","Listing Deleted!");
      res.redirect("/listings");
    })
  );


module.exports = router;
