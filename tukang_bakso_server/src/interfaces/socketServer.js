const { Server } = require("socket.io");
const UserService = require("../app/services/userService");

const joinHandler = require("../app/events/join");
const positionChangeHandler = require("../app/events/positionChange");
const disconnectHandler = require("../app/events/disconnect");
const disconnectSocketHandler = require("../app/events/disconnectSocket");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN?.split(",") || ["http://localhost:3000"],
      methods: ["GET", "POST"],
    },
  });

  const userService = new UserService();

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join", joinHandler(socket, userService));
    socket.on("position-change", positionChangeHandler(socket, userService));
    socket.on("disconnect", disconnectHandler(socket, userService));
    socket.on("disconnect_socket", disconnectSocketHandler(socket, userService));
  });

  return io;
};
