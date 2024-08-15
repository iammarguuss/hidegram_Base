import { IMessage } from "@/pages/chats/messages/messages";
import { createSlice } from "@reduxjs/toolkit";

export interface ChatStore {
  [key: string]: {
    name: string;
    data: IMessage[];
    unreadMessages: number;
    chat_id: number;
    skey: number;
    nickname: string;
    password: string;
    timestamp: number;
  };
}

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: {
      "9999": {
        id: "85475",
        name: "Test",
        unreadMessages: 0,
        chat_id: 9999,
        skey: 0,
        nickname: "Alex",
        password: "1234",
        timestamp: Date.now(),
        data: [
          {
            id: 0,
            chat_id: 9999,
            nickname: "TEST 0",
            message: "TEST 0",
            skey: 0,
            algo: 0,
            created: "2024-08-14T10:57:41.311Z",
          },
        ],
      },
    } as ChatStore,
  },
  reducers: {
    setMessagesByChatId: (state, action) => {
      const chatId = action.payload.id;

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
      const chatId = action.payload["chat_id"];

      if (!state.messages[chatId]) return alert("Current chat could not found");

      state.messages[chatId].data = state.messages[chatId].data.concat(
        action.payload
      );
    },

    setLastEnterTimestamp: (state, action) => {
      const chatId = action.payload.id;

      if (!state.messages[chatId]) return alert("Current chat could not found");

      state.messages[chatId].timestamp = action.payload.data;
    },
  },
});

export const {
  setMessagesByChatId,
  addNewMessageByChatId,
  setLastEnterTimestamp,
} = chatSlice.actions;

export default chatSlice;
