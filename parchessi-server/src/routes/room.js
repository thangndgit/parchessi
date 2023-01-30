// Import base
const express = require("express");

// Import controller
const ctrlRoom = require("../controllers/api/room");

// Create router
const router = express.Router();

// Apply controller
router.post("", ctrlRoom.create);
router.get("", ctrlRoom.get);
router.get("/:roomId", ctrlRoom.getById);
router.put("/:roomId", ctrlRoom.updateById);
router.delete("/:roomId", ctrlRoom.deleteById);

// Export router
module.exports = router;
