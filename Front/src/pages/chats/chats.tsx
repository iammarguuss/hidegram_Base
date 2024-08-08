import { FC, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import SearchIcon from "/search-icon.svg";
import NewChatIcon from "/icon-new-chat.svg";

import SidebarWrapper from "@/components/sidebarWrapper";
import ContentWrapper from "@/components/contentWrapper";
import Menu from "@/components/menu/menu";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Header from "@/components/header";
import EditBtn from "@/components/editBtn";
import Scrollable from "@/components/scrollable";
import ChatItem from "./chatItem";
import { ChatStore } from "@/stores/chatStore";

interface IChatsProps {
  chatStore: ChatStore;
}

const Chats: FC<IChatsProps> = observer((props) => {
  const {
    chatStore: { chats, removeChats },
  } = props;
  const [isEdit, setIsEdit] = useState(false);
  const [selectedChatsIds, setSelectedChatsIds] = useState<number[]>([]);

  const onDelete = () => {
    removeChats(selectedChatsIds);
    setSelectedChatsIds([]);
    setIsEdit(false);
  };

  const onEdit = () => {
    setIsEdit((s) => (s ? (setSelectedChatsIds([]), !s) : !s));
  }

  return (
    <>
      <SidebarWrapper>
        <Header className="md:h-[58px] md:p-[14px] md:gap-[14px] border-none">
          <EditBtn className="text-left md:hidden" onClick={onEdit}>
            {isEdit ? "Cancel" : "Edit"}
          </EditBtn>

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
          {chats.map((chat) => {
            return (
              <ChatItem
                key={chat.id}
                isEdit={isEdit}
                setSelectedChats={setSelectedChatsIds}
                {...chat}
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

      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </>
  );
});

export default Chats;
