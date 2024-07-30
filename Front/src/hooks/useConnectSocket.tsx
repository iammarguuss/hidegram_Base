import { IMessage } from "@/pages/chats/messages/messages";
import { SocketApi } from "../socket";
import { useEffect, useState } from "react";

export const useConnectSocket = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    const connectSocket = () => {
      SocketApi.createConnection();
      SocketApi.instance.on("reciveMessages", onMessageEvent);
    };

    connectSocket();
  }, []);

  const onMessageEvent = (data: IMessage[]) => {
    setMessages(data);
  };

  const sendMessage = (data: Partial<IMessage>) => {
    SocketApi.instance.emit("sendMessage", data);
  };

  return { messages, sendMessage };
};
