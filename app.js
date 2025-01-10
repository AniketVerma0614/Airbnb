//app.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // Ensure the path is correct
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//Initiate the database connection !!!
main()
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((err) => {
    console.log("Connection error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
//EJS template !!!
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));


//Root route !!!
app.get("/", (req, res) => {
  res.send("Root is working!");
});

//Creating an listing route !!!
//Inside Index Route !!!
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
      // console.log(res);
      res.render("listings/index.ejs", { allListings });

});

//New Route
app.get("/listings/new",(req,res) =>{
  res.render("listings/new.ejs")
});


//SHOW ROUTE
app.get("/listings/:id",async(req,res) => {
  let {id}=req.params;
  const listing =await Listing.findById(id);

  res.render("listings/show.ejs", {listing});

});

//Create Route
app.post("/listings",async(req,res) =>{
  // let {title,description,image,price,country,location} = req.body;
  // let listing = req.body.listing;
  const newListing =new Listing(req.body.listing);
  await newListing.save();
  // console.log(listing); 
  res.redirect("/listings");
});
// Route to test listing creation
// app.get("/testListing", async (req, res) => {
//   try {
//     let sampleListing = new Listing({
//       title: "My New Villa",
//       description: "By the beach",
//       price: 1200,
//       location: "Calangute, Goa",
//       country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample listing was saved successfully");
//     res.send("Successful testing!");
//   } catch(error){
//     console.error("Error saving the listing:", error);
//     res.send("Error creating listing");
//   }
// });

// Start the server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
