import { NavLink, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import Divider from "@/components/ui/divider";
import { FC } from "react";
import { IChat, setSelectedRoom } from "@/stores/slices/chat";
import { useDispatch } from "react-redux";
import { formatDateString } from "@/utils/date";

interface IChatItemProps {
  chat: IChat;
  isEdit: boolean;
  setSelectedChats: React.Dispatch<React.SetStateAction<number[]>>;
}

const ChatItem: FC<IChatItemProps> = (props) => {
  const { chat, isEdit, setSelectedChats } = props;
  const { pathname } = useLocation();
  const { name, chatId, unreadMessages, roomId } = chat;
  const dispatch = useDispatch();

  const lastMessage = chat.data?.length > 0 ? chat.data[0].message : "";
  const date =
    chat.data?.length > 0 ? formatDateString(chat.data[0].created) : "";

  function checkboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);

    setSelectedChats((s) =>
      s.includes(value) ? s.filter((id) => id !== value) : [...s, value]
    );
  }
  
  return (
    <div onClick={() => dispatch(setSelectedRoom(roomId))}>
      <Wrapper isEdit={isEdit} id={roomId}>
        {isEdit && (
          <div className="row-span-2 place-self-center">
            <input
              type="checkbox"
              value={chatId}
              onChange={checkboxChange}
              className="bg-black rounded-full text-blue size-5 focus:ring-offset-0 focus:ring-0"
            />
          </div>
        )}
        <div className="col-span-6 font-medium">{name}</div>
        <div className="col-span-7 line-clamp-1 text-[15px] text-gray">
          {lastMessage}
        </div>

        <div className="col-span-2 text-right text-gray text-[13px] relative top-[-4px]">
          {date}
        </div>
        {unreadMessages > 0 && (
          <div className="relative bottom-[-4px] min-w-[20px] min-h-[20px] max-h-[20px] flex text-sm justify-self-end place-content-center bg-blue rounded-full">
            <span className="leading-normal px-1.5">{unreadMessages}</span>
          </div>
        )}
      </Wrapper>
      <Divider
        className={twMerge(
          pathname.includes(`chats/${roomId}`) && "invisible",
          pathname.includes(`chats/${roomId + 1}`) && "invisible"
        )}
      />
    </div>
  );
};
export default ChatItem;

type WrapperProps = {
  children: React.ReactNode;
  isEdit: boolean;
  id: string;
};
function Wrapper({ children, isEdit, id }: WrapperProps) {
  const { pathname } = useLocation();

  if (isEdit) {
    return (
      <label className="h-[76px] p-4 grid grid-cols-8 grid-rows-2 grid-flow-col cursor-pointer hover:bg-hover">
        {children}
      </label>
    );
  }

  return (
    <NavLink
      to={`/chats/${id}`}
      className={twMerge(
        "h-[76px] p-4 grid grid-cols-8 grid-rows-2 grid-flow-col cursor-pointer hover:bg-hover",
        pathname.includes(`chats/${id}`) && "bg-hover"
      )}
    >
      {children}
    </NavLink>
  );
}
