class User {
    constructor({ socketId, coords, role, name }) {
      this.socketId = socketId;
      this.coords = coords;
      this.role = role;
      this.name = name;
    }
  }
  
  module.exports = User;