import { FC, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Input from "@/components/ui/input";
import Scrollable from "@/components/scrollable";
import MessageItem from "./messageItem";
import { SocketApi } from "../../../socket";
import { ChatStore } from "@/stores/chatStore";
import { observer } from "mobx-react-lite";
import { SteroidCrypto } from "../../../algo.js";

export interface IMessage {
  id: number;
  chat_id: number;
  nickname: string;
  message: string;
  created: string;
  skey: number;
  algo?: number;
}

interface IMessagesProps {
  chatStore: ChatStore;
}

const Messages: FC<IMessagesProps> = observer((props) => {
  const {
    chatStore: { selectedChat, nickname, setSelectedChatById, setLastMessage },
  } = props;
  const { userId } = useParams();
  // TODO remove
  // const { messages, sendMessage } = useMessagesSocket(userId);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    SocketApi.instance.on("messages", onMessageEvent);
  }, [userId]);

  const onMessageEvent = async (data: IMessage[]) => {
    const crypto = new SteroidCrypto();
    const result = [];
    for (let index = 0; index < data.length; index++) {
      const pass = await crypto.getPass(data[index].skey);
      const message = await crypto.messageEnc(data[index].message, pass, false);
      result.push({ ...data[index], message: message.t });
    }
    const date = new Date(result[result.length - 1].created);

    setLastMessage(
      0,
      result.at(result.length - 1)?.message || "",
      `${date.getHours()}:${date.getMinutes()}`
    );
    setMessages(result.reverse());
  };

  const sendMessage = (data: Partial<IMessage>) => {
    SocketApi.instance.emit("messages:send", data);
  };

  useEffect(() => {
    setSelectedChatById(userId);
  }, [userId, setSelectedChatById]);

  // TODO
  const isMoreThanTwoAuthors = false;
  // [...new Set(fakeMessages.map((msg) => msg.sender.name))].length > 2;

  const onSendMessage = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (selectedChat?.skey) {
      const crypto = new SteroidCrypto();
      const pass = await crypto.getPass(selectedChat.skey);
      const text = await crypto.messageEnc(message, pass, true);

      sendMessage({
        chat_id: 1,
        nickname,
        message: text.t,
        skey: selectedChat.skey,
      });
      setMessage("");
    } else {
      navigate("/chats");
    }
  };

  return (
    <>
      <NavLink to="/chats/chat-settings">
        <Header>
          <BackBtn className="md:hidden" />

          <div className={twMerge("text-center md:text-left")}>
            <h1 className="text-lg font-medium md:text-base">
              {selectedChat?.name || nickname}
            </h1>
            <p className="text-[13px] md:text-[14px] text-gray">
              {`ID: ${selectedChat?.id}`}
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
});

export default Messages;
