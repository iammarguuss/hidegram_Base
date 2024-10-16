import io, { Socket } from "socket.io-client";

export class SocketApi {
  static instances: Map<string, Socket> = new Map();

  static createConnection({
    chatId,
    skey,
  }: {
    chatId: number;
    skey: number;
  }): Socket {
    const socket = io(import.meta.env.VITE_SERVER_URL, {
      query: {
        chatId,
        skey,
      },
    });

    socket.on("connect", () => {
      if (socket.id) {
        this.instances.set(socket.id, socket);
      }
    });

    socket.on("disconnect", () => {
      if (socket.id) {
        this.instances.delete(socket.id);
      }
    });

    if (import.meta.env.MODE === "dev") {
      socket.onAny((event, ...args) => {
        console.log("ANY: ", {
          socket: socket.id,
          event,
          args,
          instances: SocketApi.instances,
        });
      });
    }

    return socket;
  }
}
