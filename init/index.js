//index.js
//We are here ==> going to write the whole ==>Initailization !!! ==> Process !!!
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require('../models/listing.js');

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

const initDB = async() => {
    await Listing.deleteMany({}); //1st we are here trying to delete the ==> data ==> that it initially contains !!!
    await Listing.insertMany(initData.data);
    console.log("data was initialized !!!");
}


initDB();