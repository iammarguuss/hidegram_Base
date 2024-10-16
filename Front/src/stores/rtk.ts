import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./slices/chat";
import exchangeSlice from "./slices/exchange";

const store = configureStore({
  reducer: {
    chatSlice: chatSlice.reducer,
    exchangeSlice: exchangeSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type IRootState = ReturnType<typeof store.getState>;

export default store;
