import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Scrollable from "@/components/scrollable";
import Divider from "@/components/ui/divider";
import Input from "@/components/ui/input";
import Switcher from "@/components/ui/switcher";
import { NavLink } from "react-router-dom";

function Database() {
	return (
		<>
			<Header>
				<BackBtn to=".." />
				<span className="text-lg font-semibold">Database</span>
				<EditBtn className="invisible" />
			</Header>

			<Scrollable className="max-w-2xl mx-auto">
				<div>
					<p className="mb-[6px] px-4 text-sm text-gray">REQUEST</p>
					<Input
						type="text"
						placeholder="Text Field"
						className="md:rounded-[10px]"
					/>
				</div>

				<div>
					<p className="mb-[6px] pl-4 text-sm text-gray">FILTERS</p>
					<div className="bg-darkGray md:rounded-[10px]">
						<NavLink
							to="/settings/db-product"
							className="h-[50px] px-4 flex justify-between items-center md:rounded-t-[10px] hover:bg-hover cursor-pointer"
						>
							<p className="text-[17px] font-medium">Product</p>
							<div className="flex gap-[13px]">
								<p className="text-[17px] text-gray">Chat</p>
								<img
									src="/arrow-right.svg"
									alt="arrow left icon"
								/>
							</div>
						</NavLink>
						<Divider full />

						<NavLink
							to="/settings/db-order"
							className="h-[50px] px-4 flex justify-between items-center hover:bg-hover cursor-pointer"
						>
							<p className="text-[17px] font-medium">Order</p>
							<div className="flex gap-[13px]">
								<p className="text-[17px] text-gray">By A-Z</p>
								<img
									src="/arrow-right.svg"
									alt="arrow left icon"
								/>
							</div>
						</NavLink>
						<Divider full />

						<NavLink
							to="/settings/db-number"
							className="h-[50px] px-[14px] flex justify-between items-center hover:bg-hover md:rounded-b-[10px] cursor-pointer"
						>
							<p className="text-[17px] font-medium">Number</p>
							<div className="flex gap-[13px]">
								<p className="text-[17px] text-gray">50</p>
								<img
									src="/arrow-right.svg"
									alt="arrow left icon"
								/>
							</div>
						</NavLink>
					</div>
					<p className="mb-[6px] mt-[6px] pl-4 text-sm text-gray">
						Turn this off if you want to receive notifications only
						from your active account.
					</p>
				</div>

				<div>
					<div className="px-4 text-sm text-gray mb-[6px]">
						SEARCH TYPE
					</div>
					<Switcher
						label="Strict"
						classNameLabel="mb-[9px] md:rounded-[10px]"
					/>
					<div className="px-4 text-sm text-gray">
						Turn this off if you want to receive notifications only
						from your active account.
					</div>
				</div>

				<NavLink
					to="/settings/db-search"
					className="w-full min-h-[44px] flex items-center px-4 text-blue justify-center md:justify-start bg-darkGray md:rounded-[10px] mx-auto"
				>
					Search
				</NavLink>
			</Scrollable>
		</>
	);
}

export default Database;
