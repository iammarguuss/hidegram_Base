import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Divider from "@/components/ui/divider";
import Input from "@/components/ui/input";

function EditNickname() {
	return (
		<>
			<Header className="bg-black">
				<BackBtn />
				<span className="text-lg font-semibold">Edit Nickname</span>
				<EditBtn />
			</Header>

			<div className="max-w-2xl mx-auto mt-[25px] md:bg-darkGray md:rounded-[10px]">
				<Divider full className="ml-0 md:hidden md:ml-4" />
				<Input
					type="text"
					placeholder="Text Field"
					className="h-[58px] md:h-[50px] px-[14px] md:rounded-[10px] bg-black md:bg-darkGray text-[20px] md:text-[17px] border border-borderColor border-x-0 md:border-0 placeholder:text-[20px] md:placeholder:text-[17px]"
				/>
				<Divider full className="ml-0 md:ml-4" />
				<Input
					type="text"
					placeholder="Last Name"
					className="h-[58px] md:h-[50px] px-[14px] md:rounded-[10px] bg-black md:bg-darkGray text-[20px] md:text-[17px] border border-borderColor border-t-0 border-x-0 md:border-0 md:placeholder:text-[17px]"
				/>
				<Divider full className="ml-0 md:hidden md:ml-4" />
			</div>
		</>
	);
}

export default EditNickname;
