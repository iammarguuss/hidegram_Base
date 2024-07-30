import { twMerge } from "tailwind-merge";
// import ImageMsg from "./imageMsg";
// import FileMsg from "./fileMsg";
import TextMsg from "./textMsg";
import { IMessage } from "./messages";

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

type Props = {
  message: IMessage;
  isMoreThanTwoAuthors: boolean;
  isSameAuthor: { prev: boolean; next: boolean };
};

function MessageItem({ message, isMoreThanTwoAuthors, isSameAuthor }: Props) {
  const isMe = message.nickname === "Bob";
  const isName = isMoreThanTwoAuthors && !isMe && !isSameAuthor.next;

  const isFirstMsg = isSameAuthor.prev && !isSameAuthor.next;
  const isLastMsg = !isSameAuthor.prev && isSameAuthor.next;
  const isInBetween = isSameAuthor.prev && isSameAuthor.next;

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
      <TextMsg
        message={message}
        isMe={isMe}
        isName={isName}
        isInBetween={isInBetween}
      />

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
    </li>
  );
}
export default MessageItem;
