import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Input from "@/components/ui/input";
import Header from "@/components/header";
import Scrollable from "@/components/scrollable";
import Button from "@/components/ui/button";
import { FC, useState } from "react";
import { ChatStore } from "@/stores/chatStore";
import { SocketApi } from "@/socket";
import { useNavigate } from "react-router-dom";

import { SteroidCrypto } from "../../algo.js";

interface INewChatProps {
  chatStore: ChatStore;
}

const NewChat: FC<INewChatProps> = (props) => {
  const { chatStore } = props;
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleConnect = async () => {
    const crypto = new SteroidCrypto();
    const skey = await crypto.getSkey(password);
    
    const chat = {
      id: chatStore.chats.length,
      name,
      lastMessage: "lastMessage",
      unreadMessages: 0,
      date: "date",
      skey,
    };

    chatStore.setNickname(nickname);
    chatStore.addChat(chat);
    navigate(`/chats/${chat.id}`);
  };

  const onConnect = async () => {
    const crypto = new SteroidCrypto();
    const skey = await crypto.getSkey(password);

    SocketApi.createConnection({ chatId: 1, skey });
    SocketApi.instance.on("connect", handleConnect);
  };

  return (
    <>
      <Header>
        <BackBtn />
        <span className="text-lg font-semibold">New Chat</span>
        <EditBtn />
      </Header>

      <Scrollable>
        {/* <div className="w-full max-w-2xl mx-auto">
					<div className="px-4 text-sm text-gray mb-[6px]">
						CHAT HEADER
					</div>
					<Input
						placeholder="Chat Header"
						className="md:rounded-[10px] text-[17px] mb-[9px]"
					/>
					<div className="px-4 text-sm text-gray">
						If you change your password, your messages recipient
						must also change it to suspect the conversation.
					</div>
				</div> */}

        {/* <div className="w-full max-w-2xl mx-auto">
					<div className="px-4 text-sm text-gray mb-[6px]">
						CHAT ID
					</div>
					<Input
						placeholder="Re-Enter Your Password"
						className="px-4 md:rounded-[10px] text-[17px] mb-[9px]"
					/>
					<div className="px-4 text-sm text-gray">
						If you change your password, your messages recipient
						must also change it to suspect the conversation.
					</div>
				</div> */}

        <div className="w-full max-w-2xl mx-auto">
          <div className="px-4 text-sm text-gray mb-[6px]">MY NICKNAME</div>
          <Input
            placeholder="Enter Your Master Password"
            className="md:rounded-[10px] text-[17px] mb-[9px]"
            value={nickname}
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
              setNickname(target.value)
            }
          />
          {/* <div className="px-4 text-sm text-gray">
            If you change your password, your messages recipient must also
            change it to suspect the conversation.
          </div> */}
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
            placeholder="Enter Your Master Password"
            className="md:rounded-[10px] text-[17px] mb-[9px]"
            value={name}
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
              setName(target.value)
            }
          />
          {/* <div className="px-4 text-sm text-gray">Name of the chat</div> */}
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
  interface Window {
    SteroidCrypto: any;
    algo: any;
  }
}
