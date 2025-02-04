const { createServer } = require("http");
const Client = require("socket.io-client");
const createSocketServer = require("../src/interfaces/socketServer");

let io, clientSocket;

beforeAll((done) => {
  const httpServer = createServer();
  io = createSocketServer(httpServer);

  httpServer.listen(() => {
    const port = httpServer.address().port;
    clientSocket = Client(`http://localhost:${port}`);
    clientSocket.on("connect", done);
  });
});

afterAll(() => {
  io.close();
  clientSocket.close();
});

test("User can join and receive current-user event", (done) => {
  const testUser = { coord: { lat: 0, lng: 0 }, role: "user", name: "Test User" };

  clientSocket.emit("join", testUser);
  clientSocket.on("current-user", (user) => {
    expect(user.name).toBe("Test User");
    done();
  });
});
