import { IMessage } from "@/pages/chats/messages/messages";
import { SocketApi } from "../socket";
import { useEffect, useState } from "react";

export const useConnectSocket = (userId?: string) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    SocketApi.instance.on("messages", onMessageEvent);
  }, [userId]);

  const onMessageEvent = (data: IMessage[]) => {
    setMessages(data.reverse());
  };

  const sendMessage = (data: Partial<IMessage>) => {
    SocketApi.instance.emit("messages:send", data);
  };

  return { messages, sendMessage };
};
