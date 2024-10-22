import { randomChatId } from "@/utils/helpers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IExchangeState {
  generatedPassword: boolean;
  password: string;
  passwordLength: number; // min length 16 max 64
  useSpecialCharacters: boolean;
  useCapitalLetters: boolean;
  useNumbers: boolean;
  waitingTime: number;
  chatId: number;
  verificationPhrase: boolean;
}

const exchangeSlice = createSlice({
  name: "exchange",
  initialState: {
    generatedPassword: true,
    password: "",
    passwordLength: 32,
    useSpecialCharacters: true,
    useCapitalLetters: true,
    useNumbers: true,
    waitingTime: 30,
    chatId: randomChatId(),
    verificationPhrase: false,
  } as IExchangeState,
  reducers: {
    setGeneratedPassword: (state, action: PayloadAction<boolean>) => {
      state.generatedPassword = action.payload;
    },

    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },

    setPasswordLength: (state, action: PayloadAction<number>) => {
      state.passwordLength = action.payload;
    },

    setUseSpecialCharacters: (state, action: PayloadAction<boolean>) => {
      state.useSpecialCharacters = action.payload;
    },

    setUseCapitalLetters: (state, action: PayloadAction<boolean>) => {
      state.useCapitalLetters = action.payload;
    },

    setUseNumbers: (state, action: PayloadAction<boolean>) => {
      state.useNumbers = action.payload;
    },

    setWaitingTime: (state, action: PayloadAction<number>) => {
      state.waitingTime = action.payload;
    },

    setChatId: (state, action: PayloadAction<number>) => {
      state.chatId = action.payload;
    },

    setVerificationPhrase: (state, action: PayloadAction<boolean>) => {
      state.verificationPhrase = action.payload;
    },
  },
});

export const {
  setGeneratedPassword,
  setPassword,
  setPasswordLength,
  setUseSpecialCharacters,
  setUseCapitalLetters,
  setUseNumbers,
  setWaitingTime,
  setChatId,
  setVerificationPhrase,
} = exchangeSlice.actions;

export default exchangeSlice;
