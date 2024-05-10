import { twMerge } from "tailwind-merge";
import { Message } from "./messageItem";

type Props = {
	message: Message;
	isMe: boolean;
	isName: boolean;
	isFirstMsg: boolean;
	isLastMsg: boolean;
};

function ImageMsg({ message, isMe, isName, isFirstMsg, isLastMsg }: Props) {
	return (
		<div className="relative">
			{isName && (
				<p
					className={twMerge(
						"h-7 md:h-6 pt-1.5 px-[10px] pb-1",
						"font-medium text-[15px] md:text-xs"
					)}
				>
					{message.sender.name}
				</p>
			)}
			<img
				src={message.content.url}
				alt="image"
				className={twMerge(
					// prettier-ignore
					isMe
						? twMerge("rounded rounded-l-[14px]", 
							isFirstMsg && "rounded-tl-[14px]",
							isLastMsg && "rounded-br-[14px]")
						: twMerge("rounded-bl rounded-br-[14px]",
							!isName && 'rounded-tr-[14px] rounded-tl', 
							isFirstMsg && "rounded-tl-[14px]",
							isLastMsg && "rounded-bl-[14px]")
				)}
			/>
			<p className="absolute bottom-2 right-2 py-0.5 px-1 text-[11px] rounded-md text-[#D7D7D7] bg-[#313131b3]">
				{new Intl.DateTimeFormat("en-US", {
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
				}).format(new Date(message.timestamp))}
			</p>
		</div>
	);
}

export default ImageMsg;
