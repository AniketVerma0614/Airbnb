//app.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // Ensure the path is correct

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Initiate the database connection
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

// Root route
app.get("/", (req, res) => {
  res.send("Root is working!");
});

// Route to test listing creation
app.get("/testListing", async (req, res) => {
  try {
    let sampleListing = new Listing({
      title: "My New Villa",
      description: "By the beach",
      price: 1200,
      location: "Calangute, Goa",
      country: "India",
    });

    await sampleListing.save();
    console.log("Sample listing was saved successfully");
    res.send("Successful testing!");
  } catch(error){
    console.error("Error saving the listing:", error);
    res.send("Error creating listing");
  }
});

// Start the server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
