import { twMerge } from "tailwind-merge";
import { Message } from "./messageItem";

type Props = {
	message: Message;
	isName: boolean;
	isMe: boolean;
	isInBetween: boolean;
};

function TextMsg({ message, isName, isMe, isInBetween }: Props) {
	return (
		<>
			{isName && (
				<p
					className={twMerge(
						"pt-1.5 px-2.5 md:pt-1",
						isInBetween && "px-2.5",
						"text-[15px] md:text-xs font-medium"
					)}
				>
					{message.sender.name}
				</p>
			)}
			<p
				className={twMerge(
					"py-1 px-2.5",
					isInBetween && "px-2.5 py-1.5",
					isName && "pt-0"
				)}
			>
				<span className="text-[17px] md:text-sm">
					{message.content.text}
				</span>
				<span
					className={twMerge(
						"relative top-[8px] text-xs float-end pl-2.5 pb-2",
						isMe ? "text-[#DAEFFF]" : "text-[#A1AAB3]"
					)}
				>
					{new Intl.DateTimeFormat("en-US", {
						hour: "numeric",
						minute: "2-digit",
						hour12: true,
					}).format(new Date(message.timestamp))}
				</span>
			</p>
		</>
	);
}

export default TextMsg;
