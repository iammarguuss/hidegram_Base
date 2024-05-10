import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Scrollable from "@/components/scrollable";
import Button from "@/components/ui/button";
import Divider from "@/components/ui/divider";
import Input from "@/components/ui/input";

function PassSettings() {
	return (
		<>
			<Header>
				<BackBtn to=".." />
				<span className="text-lg font-semibold">Password Settings</span>
				<EditBtn className="invisible" />
			</Header>

			<Scrollable className="max-w-2xl mx-auto">
				<div>
					<div className="bg-darkGray md:rounded-[10px]">
						<label className="px-4 py-[24px] flex justify-between h-[58px] items-center bg-darkGray cursor-pointer hover:bg-hover md:rounded-t-[10px]">
							<span className="text-[17px]">Generated</span>
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
							<span className="text-[17px]">Defined</span>
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
						Turn this off if you want to receive notifications only
						from your active account.
					</p>
				</div>

				<div>
					<div className="mb-[6px] ml-[16px] text-gray text-sm">
						DEFINED PASSWORD
					</div>
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
						Turn this off if you want to receive notifications only
						from your active account.
					</div>
				</div>

				<Button>Apply</Button>
			</Scrollable>
		</>
	);
}

export default PassSettings;
