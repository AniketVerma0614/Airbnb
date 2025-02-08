//post.js
const express = require("express");
const router = express.Router();
/* --------------------------
   POSTS ROUTES
-------------------------- */

// GET: List all posts
router.get("/", (req, res) => {
    res.send("GET for posts");
  });
  
  // GET: Show a specific post by ID
router.get("/:id", (req, res) => {
    res.send("GET for post");
  });
  
  // POST: Create a new post
router.post("/", (req, res) => {
    res.send("POST for posts");
  });
  
  // DELETE: Delete a specific post by ID
router.delete("/:id", (req, res) => {
    res.send("DELETE for post id");
  });


module.exports = router;