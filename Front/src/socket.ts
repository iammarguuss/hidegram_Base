import io, { Socket } from "socket.io-client";

export class SocketApi {
  private static socket: Socket | null = null;

  static createConnection() {
    this.instance.on("connect", this.onConnect);
    this.instance.on("disconnect", this.onDisconnect);
  }

  static get instance(): Socket {
    // TODO from env
    return this.socket ? this.socket : io("http://localhost:3000/");
  }

  static onConnect() {
    console.log("Connect");
  }

  static onDisconnect() {
    console.log("Disconnect");
  }
}
