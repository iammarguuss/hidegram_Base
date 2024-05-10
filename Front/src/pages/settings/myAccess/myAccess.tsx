import { NavLink } from "react-router-dom";
import Header from "@/components/header";
import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Scrollable from "@/components/scrollable";
import Switcher from "@/components/ui/switcher";
import Divider from "@/components/ui/divider";
import Button from "@/components/ui/button";

function MyAccess() {
	return (
		<>
			<Header className="justify-between">
				<BackBtn to=".." />
				<span className="text-lg font-semibold">Access</span>
				<EditBtn className="invisible" />
			</Header>

			<Scrollable className="max-w-2xl mx-auto">
				<div>
					<p className="mb-[6px] pl-4 text-sm text-gray">
						ACCESS SETTINGS
					</p>
					<div className="bg-darkGray md:rounded-[10px]">
						<NavLink
							to="/settings/edit-nickname"
							className="h-[50px] px-4 flex justify-between items-center md:rounded-t-[10px] hover:bg-hover cursor-pointer"
						>
							<p className="text-[17px]">Edit Nickname</p>
							<img src="/arrow-right.svg" alt="arrow left icon" />
						</NavLink>
						<Divider full />

						<NavLink
							to="/settings/edit-password"
							className="h-[50px] px-4 flex justify-between items-center hover:bg-hover cursor-pointer"
						>
							<p className="text-[17px]">Edit Password</p>
							<img src="/arrow-right.svg" alt="arrow left icon" />
						</NavLink>
						<Divider full />

						<NavLink
							to="/settings/my-access"
							className="h-[50px] px-[14px] flex justify-between items-center hover:bg-hover md:rounded-b-[10px] cursor-pointer"
						>
							<p className="text-[17px]">Default Nickname</p>
							<div className="flex gap-4">
								<p className="text-[17px] text-gray">
									Unknownuser5213
								</p>
								<img
									src="/arrow-right.svg"
									alt="arrow left icon"
								/>
							</div>
						</NavLink>
					</div>
				</div>

				<div>
					<p className="mb-[6px] pl-4 text-sm text-gray">
						CHAT SETTINGS
					</p>
					<div className="bg-darkGray md:rounded-[10px]">
						<Switcher
							label="Save Unread Messages"
							classNameLabel="md:rounded-t-[10px]"
						/>
						<Divider full />

						<Switcher label="Load All Chats On Connection" />
						<Divider full />

						<Switcher
							label="Provide Default Data in Change"
							classNameLabel="md:rounded-b-[10px]"
						/>
					</div>
				</div>

				<div>
					<div className="px-4 text-sm text-gray mb-[6px]">
						SYNCHRONIZATION
					</div>
					<Switcher
						label="Save Settings To Access"
						classNameLabel="mb-[9px] md:rounded-[10px]"
					/>
					<div className="px-4 text-sm text-gray">
						Turn this off if you want to receive notifications only
						from your active account.
					</div>
				</div>

				<Button className="text-red">Delete Access Data</Button>

				<Button className="text-red">Log Out</Button>
			</Scrollable>
		</>
	);
}

export default MyAccess;
