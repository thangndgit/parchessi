// Import base
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create schema
const userSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

// Create model and export
module.exports = mongoose.model("User", userSchema);
