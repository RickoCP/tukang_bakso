import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

export const SocketService = {
  connect: () => {
    return io(ENDPOINT);
  },
};
