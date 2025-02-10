//listings.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const {isLoggedIn,isOwner, validateListing } = require("../middleware.js");





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
 router.get("/new",isLoggedIn, (req, res) => {
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

    const listing = await Listing.findById(id)
          .populate({
            path: "reviews",
            populate : {
              path: "author",
            },
          })
        .populate("owner");

    // If no listing is found, flash an error and redirect to the main listings page:
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }
    console.log(listing);
    // Otherwise, render the show page:
    res.render("listings/show.ejs", { listing });
  })
);

  
  
  // Create Route
  router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res, next) => {
      // With the check moved into validateListing, this is no longer needed:
      // if (!req.body.listing) {
      //   throw new ExpressError(400, "Send valid data for listings");
      // }
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      await newListing.save();
      req.flash("success","New Listing Created!");
      res.redirect("/listings");
    })
  );
  
// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
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
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async (req, res) => {
      let {id} = req.params;   
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      console.log(req.user);
      req.flash("success","Listing Updated !");
      res.redirect(`/listings/${id}`);
    })
  );
  
  
  // Delete Route
  router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      req.flash("success","Listing Deleted!");
      res.redirect("/listings");
    })
  );


module.exports = router;
