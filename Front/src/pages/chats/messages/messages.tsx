import React, { FC, useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Input from "@/components/ui/input";
import Scrollable from "@/components/scrollable";
import MessageItem from "./messageItem";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/stores/rtk.js";
import {
  setLastEnterTimestamp,
  setMessagesByChatId,
  setSelectedRoom,
} from "@/stores/slices/chat.js";
import { SocketApi } from "@/socket";

export interface IMessage {
  id: number;
  chatId: number;
  nickname: string;
  message: string;
  created: string;
  skey: number;
  algo?: number;
}

export interface IMessageBackend {
  id: number;
  chat_id: number;
  nickname: string;
  message: string;
  created: string;
  skey: number;
  algo?: number;
}

const TIMEOUT_BETWEEN_MESSAGES = 400;

const Messages: FC = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [messageQueue, setMessageQueue] = useState<
    Array<Partial<IMessageBackend> & { rawMessage?: string }>
  >([]);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const roomList = useSelector((s: IRootState) => s.chatSlice.messages);

  const currentRoom = roomList[id!];

  const setLastTimestamp = useCallback(() => {
    if (currentRoom) {
      dispatch(
        setLastEnterTimestamp({ roomId: currentRoom.roomId, data: Date.now() })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom?.roomId, dispatch]);

  useEffect(() => {
    setLastTimestamp();
    return () => {
      setLastTimestamp();
    };
  }, [setLastTimestamp]);

  useEffect(() => {
    const currentChat = roomList[id!];
    if (currentChat) {
      SocketApi.instances.get(id!)?.emit("messages:get", {
        chat_id: currentChat.chatId,
        skey: currentChat.skey,
      });
      return;
    }
    navigate("/chats");
  }, [id]);

  useEffect(() => {
    const onMessageEvent = async ({
      messages,
    }: {
      id: string;
      messages: IMessageBackend[];
    }) => {
      if (!messages.length || !currentRoom.password) return;

      const crypto = new window.SteroidCrypto();
      const result: IMessage[] = [];
      const pass = await crypto.getPass(currentRoom.password);

      for (let index = 0; index < messages.length; index++) {
        const current = messages[index];
        const message = await crypto.messageEnc(current.message, pass, false);
        result.push({
          id: current.id,
          chatId: current.chat_id,
          nickname: current.nickname,
          message: message.t,
          created: current.created,
          skey: current.skey,
          algo: current.algo,
        });
      }

      dispatch(setMessagesByChatId({ ...currentRoom, data: result.reverse() }));
    };

    SocketApi.instances.get(id!)?.on("messages", onMessageEvent);
  }, [currentRoom, dispatch]);

  const handleMessageSend = useCallback(async () => {
    const sendMessage = (data: Partial<IMessageBackend>) => {
      SocketApi.instances.get(id!)?.emit("messages:send", data);
    };

    if (messageQueue.length && !isSending) {
      setIsSending(true);

      const newMessage = messageQueue[0];
      const crypto = new window.SteroidCrypto();
      const pass = await crypto.getPass(currentRoom.password);
      const text = await crypto.messageEnc(newMessage.rawMessage!, pass, true);

      newMessage.message = text.t;
      delete newMessage["rawMessage"];
      delete newMessage["id"];
      sendMessage(newMessage);

      setTimeout(() => {
        setMessageQueue((prevQueue) => prevQueue.slice(1));
        setIsSending(false);
      }, TIMEOUT_BETWEEN_MESSAGES);
    }
  }, [messageQueue, isSending, id, currentRoom?.password]);

  useEffect(() => {
    handleMessageSend();
  }, [handleMessageSend]);

  const isMoreThanTwoAuthors =
    [...new Set(currentRoom?.data.map((msg) => msg.nickname))].length > 2;

  const onSendMessage = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (!message) return;
    const newMessage = {
      chat_id: currentRoom.chatId,
      nickname: currentRoom.nickname,
      skey: currentRoom.skey,
      rawMessage: message,
      id: Date.now(),
      message: "",
    };

    setMessageQueue((prevQueue) => [...prevQueue, newMessage]);
    setMessage("");

    return () => {
      dispatch(
        setLastEnterTimestamp({ roomId: currentRoom.roomId, data: Date.now() })
      );
    };
  };

  const onBack = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(setSelectedRoom(null));
  };

  return (
    <>
      <NavLink to={`/chats/settings/${id}`}>
        <Header>
          <BackBtn className="md:hidden" onClick={onBack} />

          <div className={twMerge("text-center md:text-left")}>
            <h1 className="text-lg font-medium md:text-base">
              {currentRoom?.name || currentRoom?.nickname}
            </h1>
            <p className="text-[13px] md:text-[14px] text-gray">
              {`ID: ${currentRoom?.chatId}`}
            </p>
          </div>

          <EditBtn className="md:hidden" />
        </Header>
      </NavLink>
      <Scrollable className="h-[calc(100%-112px)] md:h-[calc(100%-110px)] p-[10px]  flex-col-reverse gap-0 after:content-[''] after:pt-5 after:h-[20px]">
        {messageQueue
          .slice()
          .filter((i) => i.rawMessage)
          .reverse()
          .map((message, i) => (
            <MessageItem
              key={`${message.id}-${i}`}
              message={{
                id: message.id!,
                chatId: message.chat_id!,
                nickname: message.nickname!,
                message: message.rawMessage!,
                created: new Date().toISOString(),
                skey: currentRoom.skey,
              }}
              isMoreThanTwoAuthors={isMoreThanTwoAuthors}
              isSameAuthor={{ prev: true, next: true }}
              pending={true}
              nickname={currentRoom.nickname}
            />
          ))}

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
              nickname={currentRoom.nickname}
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
          onFocus={setLastTimestamp}
        />

        <button
          className={twMerge(
            "hidden min-w-[112px] mr-4 text-blue md:block",
            !message && "cursor-not-allowed opacity-50"
          )}
          onClick={onSendMessage}
          disabled={!message}
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
