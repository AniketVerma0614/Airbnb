//lsisting.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {  
        type: String,
        default: "https://images.unsplash.com/photo-1729066390688-7aaeb3200146?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v) => 
            v === "" 
                ? "https://images.unsplash.com/photo-1729066390688-7aaeb3200146?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
        if(listing){
            await Review.deleteMany({_id : {$in: listing.reviews}});
        }       
});

const Listing = mongoose.model("Listing",listingSchema);
// Now we will export the MODEL form ==> Listing.js to the ==> app.js
module.exports = Listing;
