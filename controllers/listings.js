const Listing = require("../models/listing");
const mongoose = require("mongoose");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});


// module.exports.index = async (req, res) => {
//       try {
//         const allListings = await Listing.find({});
//         res.render("listings/index.ejs", { allListings });
//       } catch (err) {
//         console.error(err);
//         res.status(500).send("Error fetching listings.");
//       }
// };
// controllers/listings.js
module.exports.index = async (req, res) => {
  try {
    const { search } = req.query;
    console.log("Search query:", search); // Debug log
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { country: { $regex: search, $options: "i" } }
        ]
      };
    }
    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", { allListings, search });
  } catch (err) {
    console.error("Error in listings index:", err);
    res.status(500).send("Error fetching listings.");
  }
};




module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res, next) => {
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
  };



module.exports.createListing = async (req, res, next) => {
      let response = await geocodingClient.forwardGeocode({
          query: req.body.listing.location,
          limit: 1,
        })
        .send();



        let url =req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};

        newListing.geometry = response.body.features[0].geometry;

      let savedListing = await newListing.save();
        console.log(savedListing);  

        req.flash("success","New Listing Created!");
        res.redirect("/listings");
      };



module.exports.renderEditForm = async (req, res) => {
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
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
        res.render("listings/edit.ejs", { listing, originalImageUrl });

      };



module.exports.updateListing = async (req, res) => {
    let {id} = req.params;   
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file!== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }

    // console.log(req.user);
    req.flash("success","Listing Updated !");
    res.redirect(`/listings/${id}`);
  };




module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};