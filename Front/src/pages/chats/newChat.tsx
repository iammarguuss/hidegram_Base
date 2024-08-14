import { useDispatch } from "react-redux";
import { customAlphabet } from "nanoid";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Input from "@/components/ui/input";
import Header from "@/components/header";
import Scrollable from "@/components/scrollable";
import Button from "@/components/ui/button";
import { ChatStore } from "@/stores/chatStore";
import { SocketApi } from "@/socket";
import { setMessagesByChatId } from "@/stores/slices/chat.js";

import { SteroidCrypto } from "../../algo.js";

interface INewChatProps {
  chatStore: ChatStore;
}

//TODO REMOVE PROPS
const NewChat: FC<INewChatProps> = (props) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const nanoid = customAlphabet("1234567890abcdef", 10);

  const handleConnect = async () => {
    const crypto = new SteroidCrypto();
    const skey = await crypto.getSkey(password);
    const roomId = nanoid(5);
    const newChat = {
      id: roomId,
      name,
      data: [],
      unreadMessages: 0,
      nickname,
      skey,
      chat_id: 1,
      password,
    };

    dispatch(setMessagesByChatId(newChat));
    navigate(`/chats/${roomId}`);
  };

  const onConnect = async () => {
    const crypto = new SteroidCrypto();
    const skey = await crypto.getSkey(password);
    // TODO: Delete hard code chatId
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
