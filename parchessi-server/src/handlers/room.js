const ctrlRoom = require("../controllers/socket/room");

const handlers = (io, socket) => {
  socket.on("client connect", async (user) => {
    // Set data
    socket.data.userId = user._id;
    socket.data.username = user.username;
    socket.data.socketId = socket.id;

    console.log(`${socket.data.username} (${socket.id}) connected`);

    io.to(socket.id).emit("server connect");
  });

  socket.on("client join room", (roomId) => {
    // Get current user
    const user = {
      _id: socket.data.userId,
      username: socket.data.username,
    };

    ctrlRoom.join(user, roomId, (err, joined) => {
      // Convert error
      const error = err ? { message: err.message } : undefined;

      if (joined) {
        socket.join(joined.code);
        socket.to(joined.code).emit("server join room", error, user, joined);
      }

      io.to(socket.id).emit("server join room", error, user, joined);
    });
  });

  socket.on("client leave room", (roomId) => {
    // Get current user
    const user = {
      _id: socket.data.userId,
      username: socket.data.username,
    };

    ctrlRoom.leave(user, roomId, (err, left) => {
      // Convert error
      const error = err ? { message: err.message } : undefined;

      if (left) {
        socket.to(left.code).emit("server leave room", error, user, left);
        socket.leave(left.code);
      }

      io.to(socket.id).emit("server leave room", error, user, left);
    });
  });

  socket.on("client start game", (roomId) => {
    // Get current user
    const user = {
      _id: socket.data.userId,
      username: socket.data.username,
    };

    ctrlRoom.start(user, roomId, (err, started) => {
      // Convert error
      const error = err ? { message: err.message } : undefined;

      if (started) socket.to(started.code).emit("server start game", error, started);
      io.to(socket.id).emit("server start game", error, started);
    });
  });

  socket.on("client stop game", (roomId) => {
    // Get current user
    const user = {
      _id: socket.data.userId,
      username: socket.data.username,
    };

    ctrlRoom.stop(user, roomId, (err, stopped) => {
      // Convert error
      const error = err ? { message: err.message } : undefined;

      if (stopped) socket.to(stopped.code).emit("server stop game", error, stopped);
      io.to(socket.id).emit("server stop game", error, stopped);
    });
  });

  socket.on("client skip turn", (roomId) => {
    // Get current user
    const user = {
      _id: socket.data.userId,
      username: socket.data.username,
    };

    ctrlRoom.skip(user, roomId, (err, skipped) => {
      // Convert error
      const error = err ? { message: err.message } : undefined;

      if (skipped) {
        socket.to(skipped.code).emit("server skip turn", error, skipped);
        io.to(socket.id).emit("server skip turn", error, skipped);
      }
    });
  });

  socket.on("client roll dice", (roomId) => {
    // Get current user
    const user = {
      _id: socket.data.userId,
      username: socket.data.username,
    };

    ctrlRoom.roll(user, roomId, (err, rolled) => {
      // Convert error
      const error = err ? { message: err.message } : undefined;

      if (rolled) {
        socket.to(rolled.code).emit("server roll dice", error, rolled);
        io.to(socket.id).emit("server roll dice", error, rolled);
      }
    });
  });

  socket.on("client execute move", (roomId, moves) => {
    // Get current user
    const user = {
      _id: socket.data.userId,
      username: socket.data.username,
    };

    ctrlRoom.move(user, moves, roomId, (err, moved) => {
      // Convert error
      const error = err ? { message: err.message } : undefined;

      if (moved) {
        socket.to(moved.code).emit("server execute move", error, moved);
        io.to(socket.id).emit("server execute move", error, moved);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.data.username} (${socket.id}) disconnected`);
  });
};

module.exports = handlers;
