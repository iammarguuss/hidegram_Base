import { twMerge } from "tailwind-merge";
import BackBtn from "@/components/backBtn";
import Header from "@/components/header";
import EditBtn from "@/components/editBtn";
import Input from "@/components/ui/input";
import Divider from "@/components/ui/divider";
import Switcher from "@/components/ui/switcher";
import Scrollable from "@/components/scrollable";
import Button from "@/components/ui/button";

function ChatSettings() {
	return (
		<>
			<Header>
				<BackBtn />

				<div
					className={twMerge(
						"text-center md:text-left",
						"md:text-center"
					)}
				>
					<h1 className="text-lg font-medium md:text-base">Mark</h1>
					<p className="text-[13px] md:text-[14px] text-gray">
						ID:18539181214
					</p>
				</div>

				<EditBtn />
			</Header>

			<Scrollable className="items-center md:px-4">
				<div className="w-full max-w-2xl">
					<h2 className="mb-[6px] ml-4 text-sm text-gray">
						CONTACT DATA
					</h2>
					<div className="bg-darkGray rounded-[10px]">
						<Input
							defaultValue="Chat Name"
							className="text-gray md:rounded-[10px]"
						/>
						<Divider full />
						<Input defaultValue="1234567" className="text-gray" />
						<Divider full />
						<Input
							defaultValue="Onxiros"
							className="text-gray md:rounded-[10px]"
						/>
					</div>
				</div>

				<div className="w-full max-w-2xl">
					<div className="mb-[6px] ml-[16px] text-sm text-gray">
						CONTACT DATA
					</div>

					<Input
						type="password"
						defaultValue="Chat Name"
						iconEye
						className="text-gray md:rounded-[10px]"
					/>

					<div className="px-4 text-sm text-gray mt-[9px]">
						Turn this off if you want to receive notifications only
						from your active account.
					</div>
				</div>

				<div className="w-full max-w-2xl">
					<div className="px-4 text-sm text-gray mb-[6px]">
						SEARCH TYPE
					</div>
					<Switcher
						label="I Saved My Password"
						classNameLabel="mb-[9px] md:rounded-[10px]"
					/>
					<div className="px-4 text-sm text-gray">
						Turn this off if you want to receive notifications only
						from your active account.
					</div>
				</div>

				<Button>Load To Access</Button>

				<Button className="text-red">Delete Chat</Button>
			</Scrollable>
		</>
	);
}

export default ChatSettings;
