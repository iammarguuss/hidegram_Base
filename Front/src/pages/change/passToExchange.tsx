import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Scrollable from "@/components/scrollable";
import Divider from "@/components/ui/divider";
import Slider from "@/components/ui/slider";
import Switcher from "@/components/ui/switcher";
import { useState } from "react";

function PassToExchange() {
	const [chars, setChars] = useState(25);

	return (
		<>
			<Header>
				<BackBtn to=".." />
				<span className="text-lg font-semibold">
					Password To Exchange
				</span>
				<EditBtn className="invisible" />
			</Header>
			<Scrollable>
				<div className="w-full max-w-2xl mx-auto">
					<p className="text-gray mb-[6px] px-4 text-sm">
						CHARACTERS
					</p>
					<div className="h-[50px] px-4 flex items-center gap-[14px]  bg-darkGray md:rounded-[10px]">
						<span>1</span>

						<Slider value={chars} setValue={setChars} />
						<span>{chars}</span>
					</div>
					<p className="mt-[9px] text-gray mb-[6px] px-4 text-sm">
						Turn this off if you want to receive notifications only
						from your active account.
					</p>
				</div>

				<div className="w-full max-w-2xl mx-auto">
					<p className="mb-[6px] pl-4 text-sm text-gray">MY DATA</p>
					<div className="bg-darkGray md:rounded-[10px]">
						<Switcher
							label="Special Characters"
							classNameLabel="md:rounded-t-[10px]"
						/>
						<Divider full />

						<Switcher label="Chat ID" />
						<Divider full />

						<Switcher
							label="Verification Phrase"
							classNameLabel="md:rounded-b-[10px]"
						/>
					</div>
				</div>
			</Scrollable>
		</>
	);
}

export default PassToExchange;
