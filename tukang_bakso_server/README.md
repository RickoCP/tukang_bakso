# Socket.io Server Documentation (Clean Architecture & Clean Code)

## Table of Contents
1. [Introduction](#introduction)
2. [Installation & Setup](#installation--setup)
3. [Project Structure](#project-structure)
4. [Code Overview](#code-overview)
   - [Domain Layer](#domain-layer)
   - [Application Layer](#application-layer)
   - [Event Handlers](#event-handlers)
   - [Interface Layer](#interface-layer)
   - [Configuration](#configuration)
   - [Entry Point](#entry-point)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Security Considerations](#security-considerations)
8. [Conclusion](#conclusion)

---

## 1. Introduction
This documentation describes the implementation of a real-time WebSocket server using **Socket.io** in **Node.js** with **Clean Architecture** principles. The server:
- Manages real-time user connections
- Tracks user locations
- Broadcasts position updates
- Handles user disconnections

---

## 2. Installation & Setup

### Prerequisites
Ensure you have:
- **Node.js** (v14+ recommended)
- **npm** (Node Package Manager)

### Installation
Clone the repository and install dependencies:

```sh
git clone <repository_url>
cd <project_root>
npm install
```

### Environment Variables
Create a `.env` file and configure:

```ini
PORT=5000
ORIGIN=http://localhost:3000
```

For multiple origins:
```ini
ORIGIN=http://localhost:3000,http://example.com
```

### Running the Server
```sh
npm start
```

or using **nodemon** for auto-reload:
```sh
npm install -g nodemon
nodemon src/index.js
```

---

## 3. Project Structure
```
/project-root
│
├── /src
│   ├── /app
│   │   ├── /events
│   │   │   ├── join.js
│   │   │   ├── positionChange.js
│   │   │   └── disconnect.js
│   │   └── /services
│   │       └── userService.js
│   ├── /config
│   │   └── serverConfig.js
│   ├── /interfaces
│   │   └── socketServer.js
│   ├── /domain
│   │   └── user.js
│   └── index.js
│
├── /__tests__
│   └── socket.test.js
│
├── .env
├── package.json
└── README.md
```

---

## 4. Code Overview

### Domain Layer (`/domain/user.js`)
Defines the user entity:
```javascript
class User {
  constructor({ socketId, coords, role, name }) {
    this.socketId = socketId;
    this.coords = coords;
    this.role = role;
    this.name = name;
  }
}

module.exports = User;
```

### Application Layer (`/app/services/userService.js`)
Handles business logic:
```javascript
const User = require("../../domain/user");

class UserService {
  constructor() {
    this.users = [];
  }

  addUser(data) {
    const user = new User(data);
    this.users.push(user);
    return user;
  }

  removeUser(socketId) {
    this.users = this.users.filter((user) => user.socketId !== socketId);
  }

  updateUser(socketId, coords) {
    this.users = this.users.map((user) =>
      user.socketId === socketId ? { ...user, coords } : user
    );
    return this.getUser(socketId);
  }

  getUser(socketId) {
    return this.users.find((user) => user.socketId === socketId);
  }

  getAllUsers() {
    return this.users;
  }
}

module.exports = UserService;
```

### Event Handlers (`/app/events/`)
Each event has its own handler:
#### `join.js`
```javascript
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
```

#### `positionChange.js`
```javascript
module.exports = (socket, userService) => (data) => {
  const updatedUser = userService.updateUser(data.socketId, data.coords);
  socket.broadcast.emit("position-change", updatedUser);
};
```

#### `disconnect.js`
```javascript
module.exports = (socket, userService) => () => {
  userService.removeUser(socket.id);
  socket.broadcast.emit("users", userService.getAllUsers());
};
```

### Interface Layer (`/interfaces/socketServer.js`)
Defines interaction with Socket.io.
```javascript
const { Server } = require("socket.io");
const UserService = require("../app/services/userService");
const joinHandler = require("../app/events/join");
const positionChangeHandler = require("../app/events/positionChange");
const disconnectHandler = require("../app/events/disconnect");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN?.split(",") || ["http://localhost:3000"],
      methods: ["GET", "POST"],
    },
  });

  const userService = new UserService();
  io.on("connection", (socket) => {
    socket.on("join", joinHandler(socket, userService));
    socket.on("position-change", positionChangeHandler(socket, userService));
    socket.on("disconnect", disconnectHandler(socket, userService));
  });

  return io;
};
```

---

## 5. Testing
Run tests:
```sh
npm test
```

---

## 6. Deployment
Use PM2 for production:
```sh
npm install -g pm2
pm2 start src/index.js --name websocket-server
```

---

## 7. Security Considerations
- **CORS:** Restrict origins.
- **Authentication:** Implement JWT.
- **Rate Limiting:** Prevent spam.

---

## 8. Conclusion
This architecture ensures **maintainability, scalability, and testability**. Let me know if you need improvements! 🚀

