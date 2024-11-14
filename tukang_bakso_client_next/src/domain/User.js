export class User {
    constructor({ socketId, name, role, coords }) {
      this.socketId = socketId;
      this.name = name;
      this.role = role;
      this.coords = coords;
    }
  }
  