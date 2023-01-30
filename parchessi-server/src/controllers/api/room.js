// Import model
const Room = require("../../models/room");

// Import data
const { defaultGame } = require("../../data/default");

// POST - /api/rooms
exports.create = async (req, res, next) => {
  try {
    // Data to response
    const resData = {};

    // Get room with max code
    const room = await Room.findOne().sort("-code");

    // Calculate new code
    let code = "0001";
    if (room) code = (parseInt(room.code) + Math.ceil(Math.random() * 10)).toString().padStart(4, "0");

    // Create room
    const created = await Room.create({
      code: code,
      isPlaying: false,
      game: defaultGame,
      users: [{}, {}, {}, {}],
    });

    // Send response
    resData.message = "Tạo phòng thành công";
    resData.created = created;
    return res.json(resData);

    // Catch error
  } catch (err) {
    return next(err);
  }
};

// PUT - /api/rooms/:roomId
exports.updateById = async (req, res, next) => {
  try {
    // Data from request
    const id = req.params.roomId;
    const update = req.body;

    // Data to response
    const resData = {};

    // Update room
    const updated = await Room.findByIdAndUpdate(id, update);

    // Send response
    resData.message = "Cập nhật phòng thành công";
    resData.updated = updated;
    return res.json(resData);

    // Catch error
  } catch (err) {
    return next(err);
  }
};

// DELETE - /api/rooms/:roomId
exports.deleteById = async (req, res, next) => {
  try {
    // Data from request
    const id = req.params.roomId;

    // Data to response
    const resData = {};

    // Delete room
    await Room.findByIdAndDelete(id);

    // Send response
    resData.message = "Xóa phòng thành công";
    return res.json(resData);

    // Catch error
  } catch (err) {
    return next(err);
  }
};

// GET - /api/rooms
exports.get = async (req, res, next) => {
  try {
    // Get search queries
    const searchBody = req.query;

    // Data to response
    const resData = {};

    // Get all rooms
    const rooms = await Room.find(searchBody);

    // Send response
    resData.rooms = rooms;
    return res.json(resData);

    // Catch error
  } catch (err) {
    return next(err);
  }
};

// GET - /api/rooms/:roomId
exports.getById = async (req, res, next) => {
  try {
    // Data from request
    const id = req.params.roomId;

    // Data to response
    const resData = {};

    // Get all rooms
    const room = await Room.findById(id);

    // Send response
    resData.room = room;
    return res.json(resData);

    // Catch error
  } catch (err) {
    return next(err);
  }
};
