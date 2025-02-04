module.exports = (socket, userService) => (data) => {
    const user = userService.addUser({
      socketId: socket.id,
      coords: data.coord,
      role: data.role,
      name: data.name,
    });
  
    socket.broadcast.emit("new-user", user);
    socket.emit("current-user", user);
    socket.emit("users", userService.getAllUsers());
  };
  