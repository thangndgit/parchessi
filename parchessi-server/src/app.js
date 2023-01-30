// Import base
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");

// Import middleware
const mwAuth = require("./middleware/auth");
const mwError = require("./middleware/error");

// Import routes
const rteAuth = require("./routes/auth");
const rteRoom = require("./routes/room");

// Import socket handlers
const registerRoomHandlers = require("./handlers/room");

// Create server
const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  // Send log
  socket.on("client send log", (log, code) => {
    const time = new Date().toLocaleTimeString();
    const timeLog = `(${time}) ${log}`;
    socket.to(code).emit("server send log", timeLog);
    io.to(socket.id).emit("server send log", timeLog);
  });

  registerRoomHandlers(io, socket);
});

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

// Enable all CORS request
app.use(cors({ credentials: true, origin: true }));

// Use session
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "matitmui",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Use passport
app.use(passport.initialize());
app.use(passport.session());

// Use routes
app.use("/api/auth", rteAuth);
app.use("/api/rooms", rteRoom);
app.use(mwAuth);
app.use(mwError);

// Connect to database and run server
mongoose
  .connect(
    "mongodb+srv://matitmui:12345679@funix-njs101x-cluster.mvj9tlu.mongodb.net/parchessi?retryWrites=true&w=majority"
  )
  .then(() => server.listen(5000))
  .catch((err) => console.log(err));
