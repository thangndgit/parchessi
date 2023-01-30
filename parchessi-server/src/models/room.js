// Import base
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create schema
const roomSchema = Schema({
  code: String,
  isPlaying: Boolean,
  game: Schema.Types.Mixed,
  users: [Schema.Types.Mixed],
});

// Create model and export
module.exports = mongoose.model("Room", roomSchema);
