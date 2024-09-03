import { IMessage } from "@/pages/chats/messages/messages";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IChat {
  name: string;
  data: IMessage[];
  unreadMessages: number;
  chatId: number;
  skey: number;
  nickname: string;
  password: string;
  roomId: string;
  timestamp: number;
}
export interface ChatStore {
  [key: string]: IChat;
}

interface IChatState {
  messages: ChatStore;
  selectedRoom: string | null;
}

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: {} as ChatStore,
    selectedRoom: null,
  } as IChatState,
  reducers: {
    setMessagesByChatId: (state, action: PayloadAction<IChat>) => {
      const roomId = action.payload.roomId;
      const currentRoom = state.messages[roomId];

      if (currentRoom) {
        state.messages[roomId].data = action.payload.data;

        const unreadMessages = getUnreadMessages(currentRoom);
        state.messages[roomId].unreadMessages = unreadMessages;

        return;
      }

      state.messages[roomId] = action.payload;
    },

    // TODO I did not test this func
    addNewMessageByChatId: (state, action) => {
      const chatId = action.payload["chatId"];

      if (!state.messages[chatId]) return alert("Current chat could not found");

      state.messages[chatId].data = state.messages[chatId].data.concat(
        action.payload
      );
    },

    setLastEnterTimestamp: (
      state,
      action: PayloadAction<{ roomId: string; data: number }>
    ) => {
      const roomId = action.payload.roomId;
      const currentRoom = state.messages[roomId];

      if (!currentRoom) return;

      state.messages[roomId].timestamp = action.payload.data;

      const unreadMessages = getUnreadMessages(currentRoom);
      state.messages[roomId].unreadMessages = unreadMessages;
    },

    setSelectedRoom: (state, action: PayloadAction<string | null>) => {
      state.selectedRoom = action.payload;
    },

    removeChatRoom: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;

      delete state.messages[roomId];
    },
  },
});

export const {
  setMessagesByChatId,
  addNewMessageByChatId,
  setLastEnterTimestamp,
  setSelectedRoom,
  removeChatRoom,
} = chatSlice.actions;

export default chatSlice;

const getUnreadMessages = (currentRoom: IChat) => {
  const index = currentRoom.data.findIndex(
    (i) => i.nickname === currentRoom.nickname
  );
  const cropped = currentRoom.data.slice(0, index);
  const unreadMessages = cropped.filter(
    (i) =>
      new Date(i.created).getTime() > currentRoom.timestamp &&
      i.nickname !== currentRoom.nickname
  ).length;

  return unreadMessages;
};
