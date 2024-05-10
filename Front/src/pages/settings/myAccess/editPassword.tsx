import Header from "@/components/header";
import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Input from "@/components/ui/input";
import Scrollable from "@/components/scrollable";
import Button from "@/components/ui/button";

function EditPassword() {
	return (
		<>
			<Header>
				<BackBtn />
				<span className="text-lg font-semibold">Edit Password</span>
				<EditBtn />
			</Header>

			<Scrollable className="max-w-2xl mx-auto">
				<div>
					<p className="mb-[6px] ml-[16px] text-gray text-sm">
						ENTER YOUR OLD PASSWORD
					</p>

					<Input
						placeholder="Text"
						className="md:rounded-[10px]"
						iconEye
					/>

					<p className="px-4 text-sm text-gray mt-[9px]">
						Turn this off if you want to receive notifications only
						from your active account.
					</p>
				</div>

				<div>
					<p className="mb-[6px] ml-[16px] text-gray text-sm">
						ENTER YOUR NEW PASSWORD
					</p>

					<Input
						placeholder="Text Field"
						className="md:rounded-[10px]"
						iconEye
					/>

					<p className="px-4 text-sm text-gray mt-[9px]">
						Turn this off if you want to receive notifications only
						from your active account.
					</p>
				</div>

				<div>
					<p className="mb-[6px] ml-[16px] text-gray text-sm">
						CONFIRM PASSWORD
					</p>

					<Input
						placeholder="Text Field"
						className="md:rounded-[10px]"
						iconEye
					/>

					<p className="px-4 text-sm text-gray mt-[9px]">
						Turn this off if you want to receive notifications only
						from your active account.
					</p>
				</div>

				<Button>Apply</Button>
			</Scrollable>
		</>
	);
}

export default EditPassword;
