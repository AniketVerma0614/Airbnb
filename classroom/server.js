//server.js
const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretcode"));


app.get("/getsignedcookie",(req,res)=>{
        res.cookie("made-in","India",{signed: true});
        res.send("signed cookie sent");
});


app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("verified");
});

app.get("/getcookies",(req,res)=>{
    res.cookies("greet","namaste");
    res.cookies("madeIn","India");

    res.send("send you some cookies!");
});

app.get("/greet",(req,res)=>{
    let {name="anonymous"} = req.cookies;
    res.send(`Hi, ${name}`);
});

app.get("/",(req,res)=>{
    console.log(req.cookies);
    res.send("Hi,I am root!");
});





// Middleware to parse JSON (if needed)
app.use(express.json());

app.use("/users",users);
app.use("/",posts)

// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root!");
});






// Start the server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
