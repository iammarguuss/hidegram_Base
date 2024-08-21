const MAX_CHAT_ID = 1000;
const MIN_CHAT_ID = 1;

export const randomChatId = () => {
  return Math.floor(
    Math.random() * (MAX_CHAT_ID - MIN_CHAT_ID + 1) + MIN_CHAT_ID
  );
};
