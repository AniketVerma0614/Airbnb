//user.js
const express = require("express");
const router = express.Router();

/* --------------------------
   USERS ROUTES
-------------------------- */

// GET: List all users
router.get("/", (req, res) => {
    res.send("GET for users");
  });
  
  // GET: Show a specific user by ID
router.get("/:id", (req, res) => {
    res.send("GET for user");
  });
  
  // POST: Create a new user
router.post("/", (req, res) => {
    res.send("POST for users");
  });
  
  // DELETE: Delete a specific user by ID
router.delete("/:id", (req, res) => {
    res.send("DELETE for user id");
  });
  


module.exports = router;