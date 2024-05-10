import { twMerge } from "tailwind-merge";
import Button from "./ui/button";

type Props = {
	setIsShownAgreement: React.Dispatch<React.SetStateAction<boolean>>;
};

function Agreement({ setIsShownAgreement }: Props) {
	const isMobile = window.innerWidth < 768;

	return (
		<div
			className={twMerge(
				"absolute bg-darkGray max-w-3xl",
				"px-4 py-6 md:py-9 md:px-10 rounded-t-[10px] md:rounded-2xl",
				isMobile
					? "bottom-0 w-full h-5/6 flex flex-col justify-between"
					: "top-1/3 left-1/2 -translate-x-1/2 w-1/2"
			)}
		>
			<div
				onClick={() => setIsShownAgreement((s) => !s)}
				className="absolute cursor-pointer top-3 right-3"
			>
				<img src="/x-icon-dark.svg" alt="x icon" className="size-6" />
			</div>
			<div className="md:mb-6">
				<p className="mb-6 text-2xl font-bold">User agreement modal</p>
				<p>
					Tap the buttons at the bottom of the screen to try the iOS
					sheet style modal, full or partial, with animated
					transition.Credit Card generally means a plastic card issued
					by S
				</p>
			</div>

			<div className="flex flex-col justify-end md:flex-row">
				<Button
					className="md:w-[180px] m-0 md:text-center mr-4 border border-blue hidden md:block"
					onClick={() => setIsShownAgreement((s) => !s)}
				>
					No, Cancel
				</Button>

				<Button
					onClick={() => setIsShownAgreement((s) => !s)}
					className="md:w-[180px] m-0 md:text-center text-white bg-blue hover:bg-blue hover:bg-opacity-80 rounded-[10px]"
				>
					I Agree
				</Button>

				<p className="mt-8 text-xs text-center md:hidden text-gray">
					Tap the&nbsp;
					<span className="font-bold underline">
						Buttons at the bottom
					</span>
					&nbsp;of the screen to try the iOS sheet style modal, full
					or partial
				</p>
			</div>
		</div>
	);
}

export default Agreement;
