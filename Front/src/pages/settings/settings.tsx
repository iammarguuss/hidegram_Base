import { NavLink, Outlet } from "react-router-dom";
import SidebarWrapper from "@/components/sidebarWrapper";
import ContentWrapper from "@/components/contentWrapper";
import Header from "@/components/header";
import Menu from "@/components/menu/menu";
import Scrollable from "@/components/scrollable";
import Divider from "@/components/ui/divider";

function Settings() {
	return (
		<>
			<SidebarWrapper>
				<Header className="h-[72px] md:pl-[32px] items-end bg-black border-none">
					<span className="font-bold text-[34px] select-none">
						Settings
					</span>
				</Header>

				<Scrollable className="h-[calc(100%-142px)] md:h-[calc(100%-110px)] pt-2 md:px-4">
					<NavLink to="/settings/my-access">
						<p className="mb-[6px] pl-4 text-gray text-sm">
							MY ACCESS
						</p>
						<div
							className={
								"relative p-[14px] bg-darkGray md:rounded-[10px] hover:bg-hover cursor-pointer"
							}
						>
							<p className="text-[19px] font-medium">Morpheus</p>
							<p className="text-[15px] text-gray">
								ID:21304995678
							</p>
							<img
								src="/arrow-right.svg"
								alt="arrow left icon"
								className="absolute -translate-y-1/2 right-4 top-1/2"
							/>
						</div>
					</NavLink>

					<div className="bg-darkGray md:rounded-[10px]">
						<NavLink
							to="/settings/language"
							className="relative h-[50px] px-[14px] flex justify-between items-center md:rounded-t-[10px] hover:bg-hover cursor-pointer"
						>
							<p className="text-[17px]">Language</p>
							<p className="text-[17px] text-gray mr-[18px]">
								English
							</p>
							<img
								src="/arrow-right.svg"
								alt="arrow left icon"
								className="absolute -translate-y-1/2 right-4 top-1/2"
							/>
						</NavLink>
						<Divider full />

						<NavLink
							to="/settings/database"
							className="relative h-[50px] px-[14px] flex justify-between items-center hover:bg-hover cursor-pointer"
						>
							<p className="text-[17px]">Database</p>
							<img
								src="/arrow-right.svg"
								alt="arrow left icon"
								className="absolute -translate-y-1/2 right-4 top-1/2"
							/>
						</NavLink>
						<Divider full />

						<NavLink
							to="/settings/notifications"
							className="relative h-[50px] px-[14px] flex justify-between items-center hover:bg-hover md:rounded-b-[10px] cursor-pointer"
						>
							<p className="text-[17px]">Notifications</p>
							<p className="text-[17px] text-gray mr-[18px]">
								Enabled
							</p>
							<img
								src="/arrow-right.svg"
								alt="arrow left icon"
								className="absolute -translate-y-1/2 right-4 top-1/2"
							/>
						</NavLink>
					</div>

					<div className="bg-darkGray md:rounded-[10px]">
						<NavLink
							to="/settings/feedback"
							className="relative h-[50px] px-[14px] flex justify-between items-center md:rounded-t-[10px] hover:bg-hover cursor-pointer"
						>
							<p className="text-[17px]">Feedback</p>
							<img
								src="/arrow-right.svg"
								alt="arrow left icon"
								className="absolute -translate-y-1/2 right-4 top-1/2"
							/>
						</NavLink>
						<Divider full />

						<NavLink
							to="/settings"
							className="relative h-[50px] px-[14px] flex justify-between items-center hover:bg-hover cursor-pointer"
						>
							<p className="text-[17px]">About</p>
							<img
								src="/arrow-right.svg"
								alt="arrow left icon"
								className="absolute -translate-y-1/2 right-4 top-1/2"
							/>
						</NavLink>
						<Divider full />

						<NavLink
							to="/settings"
							className="relative h-[50px] px-[14px] flex justify-between items-center hover:bg-hover cursor-pointer"
						>
							<p className="text-[17px]">Privacy Policy</p>
							<img
								src="/arrow-right.svg"
								alt="arrow left icon"
								className="absolute -translate-y-1/2 right-4 top-1/2"
							/>
						</NavLink>
						<Divider full />

						<NavLink
							to="/settings/bug-report"
							className="relative h-[50px] px-[14px] flex justify-between items-center hover:bg-hover md:rounded-b-[10px] cursor-pointer"
						>
							<p className="text-[17px]">Bug Report</p>
							<img
								src="/arrow-right.svg"
								alt="arrow left icon"
								className="absolute -translate-y-1/2 right-4 top-1/2"
							/>
						</NavLink>
					</div>
				</Scrollable>

				<Menu />
			</SidebarWrapper>

			<ContentWrapper>
				<Outlet />
			</ContentWrapper>
		</>
	);
}

export default Settings;
