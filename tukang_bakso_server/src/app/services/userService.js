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
