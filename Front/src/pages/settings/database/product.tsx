import Header from "@/components/header";
import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Divider from "@/components/ui/divider";

function Product() {
	return (
		<>
			<Header>
				<BackBtn />
				<span className="text-lg font-semibold">Database</span>
				<EditBtn className="invisible" />
			</Header>

			<div className="max-w-2xl mx-auto mt-[35px] bg-darkGray md:rounded-[10px]">
				<label className="px-4 py-[24px] flex justify-between h-[58px] items-center bg-darkGray cursor-pointer hover:bg-hover md:rounded-t-[10px]">
					<span className="text-[17px]">Chat</span>
					<input
						type="radio"
						name="language"
						value="chat"
						defaultChecked
						onChange={() => {}}
						className="hidden peer"
					/>
					<img
						src="/icon-checkmark.svg"
						alt="check mark icon"
						className="hidden peer-checked:block"
					/>
				</label>
				<Divider full />
				<label className="px-4 py-[24px] flex justify-between h-[58px] items-center bg-darkGray cursor-pointer hover:bg-hover md:rounded-b-[10px]">
					<span className="text-[17px]">Access</span>
					<input
						type="radio"
						name="language"
						value="access"
						onChange={() => {}}
						className="hidden peer"
					/>
					<img
						src="/icon-checkmark.svg"
						alt="check mark icon"
						className="hidden peer-checked:block"
					/>
				</label>
			</div>
			<p className="max-w-2xl pl-4 mx-auto mt-2 text-sm text-gray ">
				Turn this off if you want to receive notifications only from
				your active account.
			</p>
		</>
	);
}

export default Product;
