module.exports = (socket, userService) => () => {
    userService.removeUser(socket.id);
    socket.broadcast.emit("users", userService.getAllUsers());
  };
  