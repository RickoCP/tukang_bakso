const http = require("http");
const serverConfig = require("./config/serverConfig");
const createSocketServer = require("./interfaces/socketServer");

const server = http.createServer();
createSocketServer(server);

server.listen(serverConfig.port, () => {
  console.log(`Server listening on port ${serverConfig.port}`);
});
