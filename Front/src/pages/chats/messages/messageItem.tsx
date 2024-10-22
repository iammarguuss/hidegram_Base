import { FC } from "react";
import { twMerge } from "tailwind-merge";

import TextMsg from "./textMsg";
import { IMessage } from "./messages";
import { Spinner } from "@/components/ui/spinner";
// import ImageMsg from "./imageMsg";
// import FileMsg from "./fileMsg";

export type Message = {
  id: string;
  type: string;
  content: {
    text?: string;
    title?: string;
    url?: string;
    icon?: string;
    description?: string;
  };
  sender: { id: string; name: string };
  timestamp: string;
  status: string;
  isRead: boolean;
};

interface IMessageItemProps {
  message: IMessage;
  isMoreThanTwoAuthors: boolean;
  isSameAuthor: { prev: boolean; next: boolean };
  nickname: string;
  pending?: boolean;
}

const MessageItem: FC<IMessageItemProps> = (props) => {
  const { message, isMoreThanTwoAuthors, isSameAuthor, nickname, pending } =
    props;
  const isMe = message.nickname === nickname;
  const isName = isMoreThanTwoAuthors && !isMe && !isSameAuthor.next;
  const isFirstMsg = isSameAuthor.prev && !isSameAuthor.next;
  const isLastMsg = !isSameAuthor.prev && isSameAuthor.next;
  const isInBetween = isSameAuthor.prev && isSameAuthor.next;

  // TODO remove
  console.log("message: ", message);
  
  return (
    <li
      className={twMerge(
        "max-w-[calc(75%)] md:max-w-[calc(45%)]",
        "mt-2 rounded",
        !isInBetween && "rounded-t-[14px]",

        // prettier-ignore
        isMe
					? twMerge("self-end bg-blue rounded-l-[14px]", 
						isFirstMsg && "rounded-tr-[14px]",
						isLastMsg && "rounded-br-[14px]",
						!isSameAuthor.prev && isSameAuthor.next && 'rounded-tr')
					: twMerge("self-start bg-darkGray rounded-r-[14px]",
						isFirstMsg && "rounded-tl-[14px]",
						isLastMsg && "rounded-bl-[14px]", 
						!isSameAuthor.prev && isSameAuthor.next && 'rounded-tl'),

        // message.type === "image" &&
        // 	"max-w-[80%] md:max-w-[30%] rounded-t-[14px]",
        isSameAuthor.next && "mt-1"
      )}
    >
      <div>
        <TextMsg message={message} isName={isName} isInBetween={isInBetween} />

        {/* {message.type === "image" && (
				<ImageMsg
					message={message}
					isMe={isMe}
					isName={isName}
					isFirstMsg={isFirstMsg}
					isLastMsg={isLastMsg}
				/>
			)} */}
        {/* 
			{message.type === "file" && (
				<FileMsg message={message} isName={isName} isMe={isMe} />
			)} */}

        <div className="px-2.5 pb-1.5 flex justify-end items-center leading-none opacity-50">
          {pending && <Spinner />}

          <div
            className={twMerge(
              "text-xs float-end pl-2",
              isMe ? "text-[#DAEFFF]" : "text-[#A1AAB3]"
            )}
          >
            {message?.created
              ? new Intl.DateTimeFormat("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }).format(new Date(message.created))
              : ""}
          </div>
        </div>
      </div>
    </li>
  );
};
export default MessageItem;
