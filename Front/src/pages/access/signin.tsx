import { NavLink } from "react-router-dom";
import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Scrollable from "@/components/scrollable";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Switcher from "@/components/ui/switcher";

function Signin() {
	return (
		<>
			<Header>
				<BackBtn to=".." />
				<span className="text-lg font-semibold">Sign In</span>
				<EditBtn className="invisible" />
			</Header>

			<Scrollable className="max-w-2xl mx-auto">
				<div className="w-full max-w-2xl">
					<div className="mb-[6px] ml-[16px] text-sm text-gray">
						ACCESS ID
					</div>
					<div className="bg-darkGray flex md:rounded-[10px]">
						<Input
							type="text"
							placeholder="Text Field"
							className="text-gray md:rounded-[10px]"
						/>
					</div>
				</div>

				<div className="w-full max-w-2xl">
					<div className="mb-[6px] ml-[16px] text-sm text-gray">
						ENTER YOUR PASSWORD
					</div>
					<div className="bg-darkGray flex md:rounded-[10px]">
						<Input
							type="password"
							placeholder="Password"
							className="text-gray md:rounded-[10px]"
						/>
					</div>
					<div className="px-4 text-sm text-gray mt-[9px]">
						If you change your password, your message recipient must
						also change it to suspect the conversation.
					</div>
				</div>

				<div className="w-full max-w-2xl mx-auto">
					<div className="px-4 text-sm text-gray mb-[6px]">
						PASSWORD CONFIRMATION
					</div>

					<Switcher
						label="Save Password Locally"
						classNameLabel="md:rounded-[10px]"
					/>
					<div className="px-4 text-sm text-gray mt-[9px]">
						Enter a few words so the sender can be sure that you
						received the code.
					</div>
				</div>

				<Button>Apply</Button>

				<NavLink to="/access/signup">
					<Button>Sign Up</Button>
				</NavLink>
			</Scrollable>
		</>
	);
}

export default Signin;
