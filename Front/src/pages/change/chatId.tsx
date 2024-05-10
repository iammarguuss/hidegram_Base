import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Input from "@/components/ui/input";

function ChatId() {
	return (
		<>
			<Header>
				<BackBtn to=".." />
				<span className="text-lg font-semibold">Chat ID</span>
				<EditBtn className="invisible" />
			</Header>

			<div className="max-w-2xl mx-auto py-[35px] gap-[35px]">
				<div className="mb-[6px] ml-[16px] text-gray">CHAT ID</div>
				<div className="bg-darkGray flex md:rounded-[10px]">
					<Input
						type="password"
						className="text-gray md:rounded-[10px]"
					/>
					<img
						src="/x-icon.svg"
						alt="show password icon"
						className="mr-4"
					/>
				</div>
				<div className="px-4 text-sm text-gray mt-[9px]">
					Turn this off if you want to receive notifications only from
					your active account.
				</div>
			</div>
		</>
	);
}

export default ChatId;
