import { NavLink } from "react-router-dom";
import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Scrollable from "@/components/scrollable";
import Button from "@/components/ui/button";
import Divider from "@/components/ui/divider";
import Input from "@/components/ui/input";
import Switcher from "@/components/ui/switcher";

function Signup() {
	return (
		<>
			<Header>
				<BackBtn to=".." />
				<span className="text-lg font-semibold">Sign Up</span>
				<EditBtn className="invisible" />
			</Header>

			<Scrollable className="max-w-2xl mx-auto">
				<div className="w-full max-w-2xl">
					<div className="mb-[6px] ml-[16px] text-sm text-gray">
						PASSWORD
					</div>
					<div className="bg-darkGray flex md:rounded-[10px]">
						<Input
							type="password"
							placeholder="Enter Your Master Password"
							className="text-gray md:rounded-[10px]"
						/>
					</div>
					<div className="px-4 text-sm text-gray mt-[9px]">
						If you change your password, your message recipient must
						also change it to suspect the conversation.
					</div>
				</div>

				<div className="w-full max-w-2xl">
					<div className="mb-[6px] ml-[16px] text-sm text-gray">
						CONFIRM YOUR PASSWORD
					</div>
					<div className="bg-darkGray flex md:rounded-[10px]">
						<Input
							type="password"
							placeholder="Re-Enter Your Password"
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
						DEFAULT DATA USAGE
					</div>

					<div className="bg-darkGray md:rounded-[10px]">
						<Switcher
							label="I Saved My Password"
							classNameLabel="md:rounded-t-[10px]"
						/>
						<Divider full />

						<Switcher
							label="I Agree With Privacy Policy"
							classNameLabel="md:rounded-b-[10px]"
						/>
					</div>
				</div>

				<Button>Create Password</Button>

				<NavLink to="/access/signin">
					<Button>Log In</Button>
				</NavLink>
			</Scrollable>
		</>
	);
}

export default Signup;
