const MAX_CHAT_ID = 1000;
const MIN_CHAT_ID = 1;

export const randomChatId = () => {
  return Math.floor(
    Math.random() * (MAX_CHAT_ID - MIN_CHAT_ID + 1) + MIN_CHAT_ID
  );
};

export const convertMinsToHrsMins = (mins: number) => {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;

  const formattedMinutes = minutes.toString().padStart(2, "0");

  return hours ? `${hours}h ${formattedMinutes}m` : `${formattedMinutes}m`;
};
