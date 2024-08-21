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
      const chatId = action.payload.roomId;

      if (state.messages[chatId]) {
        state.messages[chatId].data = action.payload.data;
        state.messages[chatId].unreadMessages = state.messages[
          chatId
        ].data.filter(
          (i) =>
            new Date(i.created).getTime() > state.messages[chatId].timestamp
        ).length;

        return;
      }

      state.messages[chatId] = action.payload;
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

      if (!state.messages[roomId]) return alert("Current chat could not found");

      state.messages[roomId].timestamp = action.payload.data;
    },

    setSelectedRoom: (state, action: PayloadAction<string | null>) => {
      state.selectedRoom = action.payload;
    },
  },
});

export const {
  setMessagesByChatId,
  addNewMessageByChatId,
  setLastEnterTimestamp,
  setSelectedRoom,
} = chatSlice.actions;

export default chatSlice;
