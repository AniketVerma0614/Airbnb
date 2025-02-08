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
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(
          400,
          `Invalid ID: "${id}" is not a valid MongoDB ObjectId`
        );
      }
      const listing = await Listing.findById(id).populate("reviews");
      if (!listing) {
        throw new ExpressError(404, "Listing not found");
      }
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
      res.redirect("/listings");
    })
  );
  
  // Edit Route
  router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
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
    })
  );
  
// Update Route
router.put(
    "/:id",
    validateListing,
    wrapAsync(async (req, res) => {
      const { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
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
      res.redirect("/listings");
    })
  );


module.exports = router;
