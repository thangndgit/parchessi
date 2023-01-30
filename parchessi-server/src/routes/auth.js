// Import base
const express = require("express");

// Import controller
const ctrlAuth = require("../controllers/api/auth");

// Create router
const router = express.Router();

// Apply controller
router.post("/sign-up", ctrlAuth.postSignUp);
router.post("/sign-in", ctrlAuth.postSignIn);
router.post("/sign-out", ctrlAuth.postSignOut);
router.get("/session", ctrlAuth.getSession);

// Export router
module.exports = router;
