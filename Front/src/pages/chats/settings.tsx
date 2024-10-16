import { twMerge } from "tailwind-merge";
import BackBtn from "@/components/backBtn";
import Header from "@/components/header";
import Input from "@/components/ui/input";
import Switcher from "@/components/ui/switcher";
import Scrollable from "@/components/scrollable";
import Button from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { IRootState } from "@/stores/rtk";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  removeChatRoom,
  setMessagesByChatId,
  updateChatRoom,
} from "@/stores/slices/chat";
import { SocketApi } from "@/socket";
import { randomChatId } from "@/utils/helpers";

const ChatSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roomList = useSelector((s: IRootState) => s.chatSlice.messages);
  const [chatName, setChatName] = useState("");
  const [chatId, setChatId] = useState(0);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  if (!id) {
    navigate("/chats");
  }

  const currentRoom = roomList[id!];

  useEffect(() => {
    if (currentRoom) {
      setChatName(currentRoom.name);
      setChatId(currentRoom.chatId);
      setNickname(currentRoom.nickname);
      setPassword(currentRoom.password);
    }
  }, [currentRoom]);

  const onDelete = () => {
    dispatch(removeChatRoom(currentRoom.roomId));
    navigate("/chats");
  };

  const onSubmit = () => {
    if (currentRoom.password !== password || currentRoom.chatId !== chatId) {
      onConnect();
    } else {
      dispatch(
        updateChatRoom({ roomId: currentRoom.roomId, nickname, name: chatName })
      );

      navigate(`/chats/${currentRoom.roomId}`);
    }
  };

  const onConnect = async () => {
    const crypto = new window.SteroidCrypto();
    const skey = await crypto.getSkey(password);
    const newChatId = chatId || randomChatId();

    if (!chatId) {
      setChatId(newChatId);
    }

    SocketApi.instances.get(id!)?.disconnect();
    const socket = SocketApi.createConnection({ chatId: newChatId, skey });
    socket.on("onConnect", handleConnect);
  };

  const handleConnect = async ({ id }: { id: string }) => {
    const crypto = new window.SteroidCrypto();
    const skey = await crypto.getSkey(password);
    const roomId = id;
    const newChat = {
      id: roomId,
      name: chatName,
      data: [],
      unreadMessages: 0,
      nickname,
      skey,
      chatId: chatId!,
      password,
      roomId,
      timestamp: Date.now(),
    };

    dispatch(setMessagesByChatId(newChat));

    SocketApi.instances.get(currentRoom.roomId)?.disconnect();
    dispatch(removeChatRoom(currentRoom.roomId));
    SocketApi.instances.delete(currentRoom.roomId);

    navigate(`/chats/${roomId}`);
  };

  return (
    <>
      <Header>
        <BackBtn />

        <div className={twMerge("text-center md:text-left", "md:text-center")}>
          <h1 className="text-lg font-medium md:text-base">
            {currentRoom.nickname}
          </h1>
          <p className="text-[13px] md:text-[14px] text-gray">
            {currentRoom.chatId}
          </p>
        </div>

        <div />
      </Header>

      <Scrollable className="items-center md:px-4">
        <div className="w-full max-w-2xl">
          <h2 className="mb-[6px] ml-4 text-sm text-gray">Chat Name</h2>
          <div className="bg-darkGray rounded-[10px]">
            <Input
              className="text-gray md:rounded-[10px]"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
            />
          </div>

          <h2 className="mb-[6px] ml-4 text-sm text-gray mt-2">Chat Id</h2>
          <div className="bg-darkGray rounded-[10px]">
            <Input
              className="text-gray"
              value={chatId}
              onChange={(e) => setChatId(+e.target.value)}
            />
          </div>

          <h2 className="mb-[6px] ml-4 text-sm text-gray mt-2">Nickname</h2>
          <div className="bg-darkGray rounded-[10px]">
            <Input
              className="text-gray md:rounded-[10px]"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full max-w-2xl">
          <div className="mb-[6px] ml-[16px] text-sm text-gray">Password</div>

          <Input
            type="password"
            iconEye
            className="text-gray md:rounded-[10px]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="w-full max-w-2xl">
          <div className="px-4 text-sm text-gray mb-[6px]">SEARCH TYPE</div>
          <Switcher
            label="Filtered"
            classNameLabel="mb-[9px] md:rounded-[10px]"
            checked={false}
            onChange={(v) => console.log("TODO add Filter", v)}
          />
          <div className="px-4 text-sm text-gray">
            Turn this off if you want to receive notifications only from your
            active account.
          </div>
        </div>

        <Button onClick={onSubmit}>Load To Access</Button>

        <Button className="text-red" onClick={onDelete}>
          Delete Chat
        </Button>
      </Scrollable>
    </>
  );
};

export default ChatSettings;
