const http = require("http");
const server = http.createServer();
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN || "http://localhost:3000",
  },
});

const PORT = process.env.PORT || 5000
let users = [];

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    const user = {
      socketId: socket.id,
      coords: data.coord,
      role: data.role,
      name:data.name
    };

    users.push(user);
    
    console.log(user)
    console.log(users)
    console.log(data)

    socket.broadcast.emit("new-user", user);
    socket.emit("current-user", user);
    socket.emit("users", users);
  });

  socket.on("position-change", (data) => {
    users = users.map((u) => {
      if (u.socketId === data.socketId) {
        return data;
      }
      return u;
    });
    console.log(users);
    console.log(data)


    io.emit("position-change", data);
    
  });

  socket.on("disconnect_socket", () => {
    users = users.filter((u) => u.socketId !== socket.id);
    socket.broadcast.emit("users", users);
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
