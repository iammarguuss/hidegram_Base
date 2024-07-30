import { useState } from "react";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Input from "@/components/ui/input";
import Scrollable from "@/components/scrollable";
import MessageItem from "./messageItem";
import { fakeMessages } from "@/../fakeData";
import { useConnectSocket as useMessagesSocket } from "@/hooks/useConnectSocket";
import { SocketApi } from "../../../socket";

export interface IMessage {
  id: number;
  chat_id: number;
  nickname: string;
  message: string;
  created: string;
  skey: number;
  algo?: number;
}

const Messages = () => {
  const { messages, sendMessage } = useMessagesSocket();
  const [message, setMessage] = useState("");

  console.log({ messages });
  console.log({ instance: SocketApi.instance });

  const isMoreThanTwoAuthors =
    [...new Set(fakeMessages.map((msg) => msg.sender.name))].length > 2;

  const onSendMessage = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    sendMessage({
      chat_id: 1,
      nickname: "TestNickname",
      message,
      skey: 1,
    });
    setMessage("");
  };

  // TODO loading
  // if (!SocketApi.instance.connected) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <NavLink to="/chats/chat-settings">
        <Header>
          <BackBtn className="md:hidden" />

          <div className={twMerge("text-center md:text-left")}>
            <h1 className="text-lg font-medium md:text-base">Mark</h1>
            <p className="text-[13px] md:text-[14px] text-gray">
              ID:18539181214
            </p>
          </div>

          <EditBtn className="md:hidden" />
        </Header>
      </NavLink>

      <Scrollable className="h-[calc(100%-112px)] md:h-[calc(100%-110px)] p-[10px]  flex-col-reverse gap-0 after:content-[''] after:pt-5 after:h-[20px]">
        {messages.map((message, i) => {
          const senderName = message.nickname;
          const isSameAuthor = {
            prev: senderName === messages[i - 1]?.nickname,
            next: senderName === messages[i + 1]?.nickname,
          };

          return (
            <MessageItem
              key={message.id}
              message={message}
              isMoreThanTwoAuthors={isMoreThanTwoAuthors}
              isSameAuthor={isSameAuthor}
            />
          );
        })}
      </Scrollable>

      <form className="h-[58px] md:h-[50px] flex border-t border-borderColor bg-darkGray md:bg-black">
        <label className="max-w-[50px] max-h-[50px] pt-[15px] pr-3 pl-[14px] flex">
          <img
            src="/icon-plus.svg"
            alt="add file icon"
            className="min-w-[19px] min-h-[19px] size-[19px]"
          />
          <input type="file" className="w-0 h-0 opacity-0" />
        </label>
        <Input
          placeholder="Text"
          className="h-[38px] mt-[6px] mr-2 md:pl-0.5 bg-black rounded-[20px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="hidden min-w-[112px] mr-4 text-blue md:block"
          onClick={onSendMessage}
        >
          Send message
        </button>

        <button className="md:hidden h-[38px] mt-[6px] mr-[12px] ml-2">
          <img
            src="/send-button.svg"
            alt="send message icon"
            className="min-w-[38px] min-h-[38px]"
          />
        </button>
      </form>
    </>
  );
};

export default Messages;
