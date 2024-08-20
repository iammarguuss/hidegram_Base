import React, { FC, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Input from "@/components/ui/input";
import Scrollable from "@/components/scrollable";
import MessageItem from "./messageItem";
import { SocketApi } from "../../../socket";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/stores/rtk.js";
import {
  setLastEnterTimestamp,
  setMessagesByChatId,
  setSelectedRoom,
} from "@/stores/slices/chat.js";

export interface IMessage {
  id: number;
  chat_id: number;
  nickname: string;
  message: string;
  created: string;
  skey: number;
  algo?: number;
}

const Messages: FC = () => {
  const { userId } = useParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const roomList = useSelector((s: IRootState) => s.chatSlice.messages);

  const currentRoom = roomList[userId!];

  useEffect(() => {
    dispatch(setLastEnterTimestamp({ ...currentRoom, data: Date.now() }));
  }, [userId]);

  useEffect(() => {
    const currentChat = roomList[userId!];
    if (currentChat) {
      SocketApi.instance.emit("messages:get", {
        chat_id: 1,
        skey: currentChat.skey,
      });
      return;
    }
    navigate("/chats");
  }, [userId]);

  useEffect(() => {
    SocketApi.instance.on("messages", onMessageEvent);
  }, [userId]);

  const onMessageEvent = async (data: IMessage[]) => {
    if (!data.length || !currentRoom.password) return;

    const crypto = new window.SteroidCrypto();
    const result = [];
    const pass = await crypto.getPass(currentRoom.password);

    for (let index = 0; index < data.length; index++) {
      const message = await crypto.messageEnc(data[index].message, pass, false);
      result.push({ ...data[index], message: message.t });
    }

    dispatch(setMessagesByChatId({ ...currentRoom, data: result.reverse() }));
  };

  const sendMessage = (data: Partial<IMessage>) => {
    SocketApi.instance.emit("messages:send", data);
  };

  // TODO
  const isMoreThanTwoAuthors = false;
  // [...new Set(fakeMessages.map((msg) => msg.sender.name))].length > 2;

  const onSendMessage = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    const crypto = new window.SteroidCrypto();
    const pass = await crypto.getPass(currentRoom.password);
    const text = await crypto.messageEnc(message, pass, true);

    sendMessage({
      chat_id: 1,
      nickname: currentRoom.nickname,
      message: text.t,
      skey: currentRoom.skey,
    });
    setMessage("");
  };

  const onBack = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(setSelectedRoom(null));
  };

  return (
    <>
      <NavLink to="/chats/chat-settings">
        <Header>
          <BackBtn className="md:hidden" onClick={onBack} />

          <div className={twMerge("text-center md:text-left")}>
            <h1 className="text-lg font-medium md:text-base">
              {currentRoom?.name || currentRoom?.nickname}
            </h1>
            <p className="text-[13px] md:text-[14px] text-gray">
              {`ID: ${currentRoom?.chat_id}`}
            </p>
          </div>

          <EditBtn className="md:hidden" />
        </Header>
      </NavLink>
      <Scrollable className="h-[calc(100%-112px)] md:h-[calc(100%-110px)] p-[10px]  flex-col-reverse gap-0 after:content-[''] after:pt-5 after:h-[20px]">
        {currentRoom?.data.map((message, i) => {
          const senderName = message.nickname;
          const isSameAuthor = {
            prev: senderName === currentRoom.data[i - 1]?.nickname,
            next: senderName === currentRoom.data[i + 1]?.nickname,
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

        <button
          className="md:hidden h-[38px] mt-[6px] mr-[12px] ml-2"
          onClick={onSendMessage}
        >
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
