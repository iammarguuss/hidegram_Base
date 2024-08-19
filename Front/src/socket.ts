import io, { Socket } from "socket.io-client";

export class SocketApi {
  private static socket: Socket | null = null;

  static createConnection({ chatId, skey }: { chatId: number; skey: number }) {
    this.socket = io(import.meta.env.VITE_SERVER_URL, {
      query: {
        chatId,
        skey,
      },
    });
    this.socket.on("connect", this.onConnect);
    this.socket.on("disconnect", this.onDisconnect);
  }

  static get instance(): Socket {
    if (this.socket === null) {
      window.location.href = "/chats/";
    }

    return this.socket!;
  }

  static onConnect() {
    console.log("Connect");
  }

  static onDisconnect() {
    console.log("Disconnect");
  }
}
