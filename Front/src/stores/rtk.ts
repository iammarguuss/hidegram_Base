import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./slices/chat";

const store = configureStore({
  reducer: {
    chatSlice: chatSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type IRootState = ReturnType<typeof store.getState>;

export default store;
