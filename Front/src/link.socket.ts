import io, { Socket } from "socket.io-client";

export class LinkSocketApi {
  static instance?: Socket;

  static createConnection(): Socket {
    const socket = io(import.meta.env.VITE_SERVER_URL, {});

    socket.on("connect", () => {
      this.instance = socket;
    });

    socket.on("disconnect", () => {
      this.instance = undefined;
    });

    if (import.meta.env.MODE === "dev") {
      socket.onAny((event, ...args) => {
        console.log("ANY: ", {
          socket: socket.id,
          event,
          args,
          instance: LinkSocketApi.instance,
        });
      });
    }

    return socket;
  }
}
