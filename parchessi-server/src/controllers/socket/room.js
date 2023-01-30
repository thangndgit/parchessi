// Import model
const { defaultGame } = require("../../data/default");
const Room = require("../../models/room");
const { getMoveStart, getMoveRacing, getMoveEnd } = require("../../utils/move");
const { getOrder } = require("../../utils/name");

// Handler when user join room
exports.join = async (user, roomId, cb = (err, joined) => {}) => {
  try {
    // Get room
    const room = await Room.findById(roomId);

    // If code is wrong
    if (!room) throw new Error("Phòng không tồn tại");

    const realUsers = room.users.filter((u) => !!u.username);
    // Get real users

    // If room is full
    if (realUsers.length === 4) throw new Error("Phòng đã đủ người");

    if (realUsers.find((u) => u.username === user.username)) return;

    // If game is playing
    if (room.isPlaying) throw new Error("Game đã bắt đầu");

    // Update users
    const id = room.users.findIndex((u) => !u.username);
    room.users[id] = user;

    // Update game
    room.game.count = realUsers.length;
    room.game.nextTurn = room.game.nextTurn.map((t, id1) => {
      const index = room.users.findIndex((u, id2) => id2 > id1 && !!u.username);
      if (index === -1) return 0;
      return index;
    });

    // Update room
    const joined = await Room.findByIdAndUpdate(roomId, room, { new: true });

    // Run callback
    cb(undefined, joined);

    // Catch error
  } catch (error) {
    cb(error);
  }
};

// Handler when user leave room
exports.leave = async (user, roomId, cb = (err, left) => {}) => {
  try {
    // Get room
    const room = await Room.findById(roomId);

    // If room does not exist
    if (!room) throw new Error("Phòng không tồn tại");

    // Get real users
    const realUsers = room.users.filter((u) => !!u.username);
    const realIndex = room.users.findIndex((u) => !!u.username);

    // Get index of user
    const index = room.users.findIndex((u) => u.username === user.username);

    // If user does not exist
    if (index === -1) return;

    // Update users
    room.users[index] = {};

    // Update game
    room.game.count = realUsers.length;
    room.game.turn = realIndex;
    room.game.nextTurn = room.game.nextTurn.map((t, id1) => {
      const index = room.users.findIndex((u, id2) => id2 > id1 && !!u.username);
      if (index === -1) return 0;
      return index;
    });

    // Update room
    const left = await Room.findByIdAndUpdate(roomId, room, { new: true });

    // If room has 0 user, delete room
    if (left.users.filter((u) => !!u.username).length === 0) await Room.findByIdAndDelete(roomId);

    // Run callback
    cb(undefined, left);

    // Catch error
  } catch (error) {
    cb(error);
  }
};

// Handler when start game
exports.start = async (user, roomId, cb = (err, started) => {}) => {
  try {
    // Get room
    const room = await Room.findById(roomId);

    // If room does not exist
    if (!room) throw new Error("Phòng không tồn tại");

    // Get real users
    const realUsers = room.users.filter((u) => !!u.username);

    // If room has less than 2 users
    if (realUsers.length < 2) throw new Error("Phòng phải có tối thiếu 2 người để bắt đầu game");

    // If user have no right to act
    if (realUsers[0].username !== user.username) throw new Error("Bạn phải là chủ phòng để có quyền bắt đầu game");

    // Change is playing state
    room.isPlaying = true;

    // Update room
    const started = await Room.findByIdAndUpdate(roomId, room, { new: true });

    // Run callback
    cb(undefined, started);

    // Catch error
  } catch (error) {
    cb(error);
  }
};

// Handler when stop game
exports.stop = async (user, roomId, cb = (err, stopped) => {}) => {
  try {
    // Get room
    const room = await Room.findById(roomId);

    // If room does not exist
    if (!room) throw new Error("Phòng không tồn tại");

    // Get index of first user
    const realIndex = room.users.findIndex((u) => !!u.username);

    // Refresh game
    const game = { ...defaultGame, turn: realIndex, nextTurn: room.game.nextTurn };

    // Update room
    room.game = game;
    room.isPlaying = false;

    // Update room
    const stopped = await Room.findByIdAndUpdate(roomId, room, { new: true });

    // Run callback
    cb(undefined, stopped);

    // Catch error
  } catch (error) {
    cb(error);
  }
};

// Handler when user skip turn
exports.skip = async (user, roomId, cb = (err, skipped) => {}) => {
  try {
    // Get room
    const room = await Room.findById(roomId);

    // If code is wrong
    if (!room) throw new Error("Phòng không tồn tại");

    // If game is not playing
    if (!room.isPlaying) return;

    // Update game
    const game = room.game;

    if (user.username !== room.users[game.turn].username) return;

    game.dice = 0;
    game.roll = 1;
    game.activeMoves.length = 0;
    game.turn = game.nextTurn[game.turn];

    room.game = game;

    // Update room
    const skipped = await Room.findByIdAndUpdate(roomId, room, { new: true });

    // Run callback
    cb(undefined, skipped);

    // Catch error
  } catch (error) {
    cb(error);
  }
};

// Handler when user roll dice
exports.roll = async (user, roomId, cb = (err, rolled) => {}) => {
  try {
    // Get room
    const room = await Room.findById(roomId);

    // If code is wrong
    if (!room) throw new Error("Phòng không tồn tại");

    // If game is not playing
    if (!room.isPlaying) return;

    // Update game
    const game = room.game;

    if (user.username !== room.users[game.turn].username) return;

    if (game.roll === 0) return;

    // Roll dice
    const dice = Math.ceil(Math.random() * 6);

    game.dice = dice;
    game.activeMoves.length = 0;
    game.roll += (dice === 1 || dice === 6) - 1;

    const pieces = [
      "p-" + (game.turn * 4 + 0),
      "p-" + (game.turn * 4 + 1),
      "p-" + (game.turn * 4 + 2),
      "p-" + (game.turn * 4 + 3),
    ];

    pieces.forEach((piece) => {
      const moveStart = getMoveStart(game, piece);
      const moveRacing = getMoveRacing(game, piece);
      const moveEnd = getMoveEnd(game, piece);
      if (moveStart.length) game.activeMoves.push(moveStart);
      if (moveRacing.length) game.activeMoves.push(moveRacing);
      if (moveEnd.length) game.activeMoves.push(moveEnd);
    });

    room.game = game;

    // Update room
    const rolled = await Room.findByIdAndUpdate(roomId, room, { new: true });

    // Run callback
    cb(undefined, rolled);

    // Catch error
  } catch (error) {
    cb(error);
  }
};

// Handler when user execute move
exports.move = async (user, moves, roomId, cb = (err, moved) => {}) => {
  try {
    if (!moves) return;

    // Get room
    const room = await Room.findById(roomId);

    // If code is wrong
    if (!room) throw new Error("Phòng không tồn tại");

    // If game is not playing
    if (!room.isPlaying) return;

    // Update game
    const game = room.game;

    if (user.username !== room.users[game.turn].username) return;

    moves.forEach((move) => {
      const pOrder = getOrder(move.piece);
      game.prevNode[pOrder] = game.currNode[pOrder];
      game.currNode[pOrder] = move.node;
    });

    game.activeMoves.length = 0;

    // Check win state
    const nodes = game.currNode.slice(4 * game.turn, 4 * game.turn + 4);
    const winNodes = [
      "c-" + (6 * game.turn + 2),
      "c-" + (6 * game.turn + 3),
      "c-" + (6 * game.turn + 4),
      "c-" + (6 * game.turn + 5),
    ];
    const hasWon = winNodes.every((wn) => nodes.includes(wn));
    if (hasWon) game.winners.push(user);

    // Skip turn when out of roll
    if (game.roll === 0) {
      game.dice = 0;
      game.roll = 1;
      game.turn = game.nextTurn[game.turn];
    }

    room.game = game;

    // Update room
    const moved = await Room.findByIdAndUpdate(roomId, room, { new: true });

    // Run callback
    cb(undefined, moved);

    // Catch error
  } catch (error) {
    cb(error);
  }
};
