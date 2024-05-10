import { twMerge } from "tailwind-merge";
import { Message } from "./messageItem";

type Props = {
	message: Message;
	isName: boolean;
	isMe: boolean;
};

function FileMsg({ message, isMe, isName }: Props) {
	return (
		<>
			{isName && (
				<p
					className={twMerge(
						"pt-1 pb-0.5 px-[10px]",
						"font-medium text-[15px] md:text-xs"
					)}
				>
					{message.sender.name}
				</p>
			)}
			<div className={twMerge("flex items-center", !isName && "pt-2.5")}>
				<div className={"pl-2.5 pb-4 md:pb-1.5 pr-1.5 md:pr-2"}>
					<svg
						width="45"
						height="45"
						viewBox="0 0 45 45"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle
							cx="22.5"
							cy="22.5"
							r="22.5"
							fill={isMe ? "white" : "#565961"}
						/>
						<path
							d="M15.6401 11C14.1845 11 13 12.1609 13 13.5875V31.4125C13 32.8391 14.1845 34 15.6401 34H29.1339C30.5894 34 31.7739 32.8391 31.7739 31.4125V20.2H25.0271C23.5715 20.2 22.387 19.0391 22.387 17.6125V11H15.6401ZM25.7387 12.3384C25.4223 12.0283 24.8887 12.2525 24.8887 12.6955V17.6125C24.8887 18.088 25.2836 18.475 25.7688 18.475H30.7755C31.2234 18.475 31.4454 17.9314 31.1255 17.6179L25.7387 12.3384ZM17.4001 22.5H27.3738C27.8596 22.5 28.2538 22.8858 28.2538 23.3625C28.2538 23.8392 27.8596 24.225 27.3738 24.225H17.4001C16.9144 24.225 16.5201 23.8392 16.5201 23.3625C16.5201 22.8858 16.9144 22.5 17.4001 22.5ZM17.4001 25.95H22.6803C23.1661 25.95 23.5603 26.3358 23.5603 26.8125C23.5603 27.2892 23.1661 27.675 22.6803 27.675H17.4001C16.9144 27.675 16.5201 27.2892 16.5201 26.8125C16.5201 26.3358 16.9144 25.95 17.4001 25.95ZM26.2004 25.95H27.3738C27.8596 25.95 28.2538 26.3358 28.2538 26.8125C28.2538 27.2892 27.8596 27.675 27.3738 27.675H26.2004C25.7146 27.675 25.3204 27.2892 25.3204 26.8125C25.3204 26.3358 25.7146 25.95 26.2004 25.95ZM17.4001 29.4H22.6803C23.1661 29.4 23.5603 29.7858 23.5603 30.2625C23.5603 30.7392 23.1661 31.125 22.6803 31.125H17.4001C16.9144 31.125 16.5201 30.7392 16.5201 30.2625C16.5201 29.7858 16.9144 29.4 17.4001 29.4ZM26.2004 29.4H27.3738C27.8596 29.4 28.2538 29.7858 28.2538 30.2625C28.2538 30.7392 27.8596 31.125 27.3738 31.125H26.2004C25.7146 31.125 25.3204 30.7392 25.3204 30.2625C25.3204 29.7858 25.7146 29.4 26.2004 29.4Z"
							fill={isMe ? "#567DFF" : "white"}
						/>
					</svg>
				</div>

				<div className={"flex flex-col justify-center"}>
					<p className="pr-8 text-sm font-semibold line-clamp-1">
						{message.content.title}
					</p>
					<p className="text-[13px] flex justify-between items-center pr-2.5 pb-4 line-clamp-1">
						<span>{message.content.description}</span>
						<span className="relative top-4 text-xs text-[#DAEFFF]">
							{new Intl.DateTimeFormat("en-US", {
								hour: "numeric",
								minute: "2-digit",
								hour12: true,
							}).format(new Date(message.timestamp))}
						</span>
					</p>
				</div>
			</div>
		</>
	);
}

export default FileMsg;
