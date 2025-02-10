//listings.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const {isLoggedIn,isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const { render } = require("ejs");


router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,validateListing,wrapAsync(listingController.createListing)
);

// New Route
router.get("/new",isLoggedIn, listingController.renderNewForm);



router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));



// Index Route

  

  
// Show Route


  
  
// Create Route

  

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

  
// Update Route

  
  
// Delete Route



module.exports = router;
