const Listing = require("../models/listing");
const mongoose = require("mongoose");


module.exports.index = async (req, res) => {
      try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
      } catch (err) {
        console.error(err);
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
        // With the check moved into validateListing, this is no longer needed:
        // if (!req.body.listing) {
        //   throw new ExpressError(400, "Send valid data for listings");
        // }
        let url =req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};
        await newListing.save();
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
        res.render("listings/edit.ejs", { listing });
      };



module.exports.updateListing = async (req, res) => {
    let {id} = req.params;   
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log(req.user);
    req.flash("success","Listing Updated !");
    res.redirect(`/listings/${id}`);
  };




module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};
