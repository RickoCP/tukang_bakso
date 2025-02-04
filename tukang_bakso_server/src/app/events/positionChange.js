module.exports = (socket, userService) => (data) => {
    const updatedUser = userService.updateUser(data.socketId, data.coords);
    socket.broadcast.emit("position-change", updatedUser);
  };
  