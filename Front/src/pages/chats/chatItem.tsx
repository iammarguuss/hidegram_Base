import { NavLink, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import Divider from "@/components/ui/divider";
import { FC } from "react";
import { IChat } from "@/interfaces/chats";

interface IChatItemProps extends IChat {
  isEdit: boolean;
  setSelectedChats: React.Dispatch<React.SetStateAction<number[]>>;
}

const ChatItem: FC<IChatItemProps> = (props) => {
  const {
    name,
    id,
    date,
    lastMessage,
    unreadMessages,
    isEdit,
    setSelectedChats,
  } = props;
  const { pathname } = useLocation();

  function checkboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);

    setSelectedChats((s) =>
      s.includes(value) ? s.filter((id) => id !== value) : [...s, value]
    );
  }

  return (
    <>
      <Wrapper isEdit={isEdit} id={id}>
        {isEdit && (
          <div className="row-span-2 place-self-center">
            <input
              type="checkbox"
              value={id}
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
        <div className="relative bottom-[-4px] min-w-[20px] min-h-[20px] max-h-[20px] flex text-sm justify-self-end place-content-center bg-blue rounded-full">
          <span className="leading-normal px-1.5">{unreadMessages}</span>
        </div>
      </Wrapper>
      <Divider
        className={twMerge(
          pathname.includes(`chats/${id}`) && "invisible",
          pathname.includes(`chats/${id + 1}`) && "invisible"
        )}
      />
    </>
  );
};
export default ChatItem;

type WrapperProps = {
  children: React.ReactNode;
  isEdit: boolean;
  id: number;
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
