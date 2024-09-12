import { FC, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import SearchIcon from "/search-icon.svg";
import NewChatIcon from "/icon-new-chat.svg";

import SidebarWrapper from "@/components/sidebarWrapper";
import Menu from "@/components/menu/menu";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Header from "@/components/header";
import Scrollable from "@/components/scrollable";
import ChatItem from "./chatItem";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/stores/rtk";
import { ChatStore, removeChatRoom } from "@/stores/slices/chat";
import ContentWrapper from "@/components/contentWrapper";
import { SocketApi } from "@/socket";

const Chats: FC = () => {
  const chatList = useSelector((s: IRootState) => s.chatSlice.messages);
  const selectedRoom = useSelector((s: IRootState) => s.chatSlice.selectedRoom);
  const dispatch = useDispatch();

  const [isEdit, setIsEdit] = useState(false);

  const onDelete = () => {
    setIsEdit(false);
  };

  const convertToArray = (object: ChatStore) => {
    const list = [];

    for (const key in object) {
      if (SocketApi.instances.has(key)) {
        const socket = SocketApi.instances.get(key);
        if (socket?.connected) {
          list.push(object[key]);
        } else {
          dispatch(removeChatRoom(key));
          SocketApi.instances.delete(key);
        }
      } else {
        dispatch(removeChatRoom(key));
      }
    }
    return list;
  };

  return (
    <>
      <SidebarWrapper>
        <Header className="md:h-[58px] md:p-[14px] md:gap-[14px] border-none">
          <div className="relative hidden w-full md:block">
            <Input
              placeholder="Search"
              className="h-9 pl-[32px] rounded-[10px]"
            />
            <img
              src={SearchIcon}
              alt="search icon"
              className="absolute left-[10px] top-[9px]"
            />
          </div>

          <div className="text-lg font-semibold md:hidden md:text-base">
            Chats
          </div>

          <NavLink to="/chats/new-chat" className="w-[55px] md:w-fit">
            <img
              src={NewChatIcon}
              alt="new chat icon"
              className="ml-auto cursor-pointer"
            />
          </NavLink>
        </Header>

        <Scrollable className="h-[calc(100%-124px)] md:h-[calc(100%-108px)] py-0 gap-0">
          {convertToArray(chatList).map((chat) => {
            return (
              <ChatItem
                key={chat.roomId}
                isEdit={isEdit}
                setSelectedChats={() => console.log("setSelectedChatsIds")}
                chat={chat}
              />
            );
          })}
        </Scrollable>

        {!isEdit && <Menu />}
        {isEdit && (
          <Button onClick={onDelete} className="h-[70px] text-lg">
            Delete
          </Button>
        )}
      </SidebarWrapper>

      <ContentWrapper showContent={!!selectedRoom}>
        <Outlet />
      </ContentWrapper>
    </>
  );
};

export default Chats;
