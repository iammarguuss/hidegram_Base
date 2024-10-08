import { useDispatch } from "react-redux";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Input from "@/components/ui/input";
import Header from "@/components/header";
import Scrollable from "@/components/scrollable";
import Button from "@/components/ui/button";
import { SocketApi } from "@/socket";
import { removeChatRoom, setMessagesByChatId } from "@/stores/slices/chat.js";
import { randomChatId } from "@/utils/helpers";

const NewChat: FC = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [chatId, setChatId] = useState<number | null>(null);

  const handleConnect = async ({ id }: { id: string }) => {
    const crypto = new window.SteroidCrypto();
    const skey = await crypto.getSkey(password);
    const roomId = id;
    const newChat = {
      id: roomId,
      name,
      data: [],
      unreadMessages: 0,
      nickname,
      skey,
      chatId: chatId!,
      password,
      roomId,
      timestamp: Date.now(),
    };

    SocketApi.instance.on("disconnect", () => handleDisconnect({ id }));

    dispatch(setMessagesByChatId(newChat));
    navigate(`/chats/${roomId}`);
  };

  const handleDisconnect = async ({ id }: { id: string }) => {
    console.log({ handleDisconnectId: id });

    dispatch(removeChatRoom(id));
    navigate(`/chats`);
  };

  const onConnect = async () => {
    const crypto = new window.SteroidCrypto();
    const skey = await crypto.getSkey(password);
    const newChatId = chatId || randomChatId();

    if (!chatId) {
      setChatId(newChatId);
    }

    SocketApi.createConnection({ chatId: newChatId, skey });
    SocketApi.instance.on("onConnect", handleConnect);
  };

  return (
    <>
      <Header>
        <BackBtn />
        <span className="text-lg font-semibold">New Chat</span>
        <EditBtn />
      </Header>

      <Scrollable>
        <div className="w-full max-w-2xl mx-auto">
          <div className="px-4 text-sm text-gray mb-[6px]">MY NICKNAME</div>
          <Input
            placeholder="Enter Your Nickname"
            className="md:rounded-[10px] text-[17px] mb-[9px]"
            value={nickname}
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
              setNickname(target.value)
            }
          />
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <div className="px-4 text-sm text-gray mb-[6px]">PASSWORD</div>
          <Input
            placeholder="Enter Your Master Password"
            className="md:rounded-[10px] text-[17px] mb-[9px]"
            iconEye
            value={password}
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(target.value)
            }
          />
          <div className="px-4 text-sm text-gray">
            If you change your password, your messages recipient must also
            change it to suspect the conversation.
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <div className="px-4 text-sm text-gray mb-[6px]">CHAT HEADER</div>
          <Input
            placeholder="Enter Your Chat Header"
            className="md:rounded-[10px] text-[17px] mb-[9px]"
            value={name}
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
              setName(target.value)
            }
          />
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <div className="px-4 text-sm text-gray mb-[6px]">CHAT ID</div>
          <Input
            placeholder="Enter the chat ID for an existing chat or leave empty for a new chat"
            className="md:rounded-[10px] text-[17px] mb-[9px]"
            value={chatId || ""}
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
              setChatId(parseInt(target.value))
            }
          />
        </div>

        {/* 
				<div className="w-full max-w-2xl mx-auto">
					<div className="px-4 text-sm text-gray mb-[6px]">
						CHAT FILTER
					</div>
					<Switcher
						label="I Saved My Password"
						classNameLabel="mb-[9px] md:rounded-[10px]"
					/>
					<div className="px-4 text-sm text-gray">
						Enter a few words so the sender can be sure that you
						received the code.
					</div>
				</div> */}

        <Button onClick={onConnect}>Connect to Chat</Button>
      </Scrollable>
    </>
  );
};

export default NewChat;

// TODO connect from git
declare global {
  interface Constructable<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any): T;
  }

  interface ISteroidCrypto {
    getSkey: (value: string) => number;
    getPass: (value: string) => string;
    messageEnc: (
      text: string,
      password: string,
      isEncrypt: boolean,
      algo?: number
    ) => {
      s: number;
      t: string;
      v: number;
    };
  }

  interface Window {
    SteroidCrypto: Constructable<ISteroidCrypto>;
  }
}
