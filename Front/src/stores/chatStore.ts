import { makeObservable, observable, action } from "mobx";

import { IChat } from "@/interfaces/chats";
import { SocketApi } from "@/socket";
import { IMessage } from "@/pages/chats/messages/messages";

export class ChatStore {
  chats: IChat[] = [];
  nickname?: string;
  selectedChat?: IChat;

  constructor() {
    makeObservable(this, {
      chats: observable,
      nickname: observable,
      selectedChat: observable,
      addChat: action,
      setNickname: action,
      removeChats: action,
      setSelectedChat: action,
      sendMessage: action,
    });
  }

  addChat(chat: IChat) {
    this.chats.push(chat);
  }

  setSelectedChat = (id?: string) => {
    if (!id) {
      this.selectedChat = undefined;
      return;
    }

    const chat = this.chats.find((i) => i.id === +id);
    if (chat) {
      SocketApi.instance.emit("messages:get", { chat_id: 1, skey: chat.skey });
      this.selectedChat = chat;
    }
  };

  setNickname(value: string) {
    this.nickname = value;
  }

  // TODO check if needed
  removeChats(selectedChatsIds: number[]) {
    this.chats = this.chats.filter(
      (chat) => !selectedChatsIds.some((id) => id === chat.id)
    );
  }

  sendMessage = (data: Partial<IMessage>) => {
    SocketApi.instance.emit("messages:send", data);
  };
}
