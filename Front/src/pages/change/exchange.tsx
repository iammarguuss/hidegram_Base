import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Divider from "@/components/ui/divider";
import { NavLink } from "react-router-dom";

function Exchange() {
	return (
		<>
			<Header>
				<BackBtn />
				<span className="text-lg font-semibold">Exchange</span>
				<EditBtn className="invisible" />
			</Header>

			<div className="max-w-2xl mx-auto py-[35px] gap-[35px]">
				<div>
					<p className="mb-[6px] pl-4 text-sm text-gray">MY KEYS</p>
					<div className="bg-darkGray md:rounded-[10px]">
						<NavLink
							to="/change/exchange"
							className="h-[50px] px-4 flex justify-between items-center md:rounded-t-[10px] hover:bg-hover cursor-pointer"
						>
							<p className="text-[17px] font-medium">
								Public Key
							</p>
							<img src="/arrow-right.svg" alt="arrow left icon" />
						</NavLink>
						<Divider full />

						<NavLink
							to="/change/exchange"
							className="h-[50px] px-[14px] flex justify-between items-center hover:bg-hover md:rounded-b-[10px] cursor-pointer"
						>
							<p className="text-[17px] font-medium">
								Private Key
							</p>
							<div className="flex gap-4">
								<img
									src="/arrow-right.svg"
									alt="arrow left icon"
								/>
							</div>
						</NavLink>
					</div>
				</div>
			</div>
		</>
	);
}

export default Exchange;
