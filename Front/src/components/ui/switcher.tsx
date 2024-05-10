import * as Switch from "@radix-ui/react-switch";
import { twMerge } from "tailwind-merge";

type Props = {
	label: string;
	classNameLabel?: React.ComponentProps<"label">["className"];
};

function Switcher({ label, classNameLabel }: Props) {
	return (
		<div
			className={twMerge(
				"h-[50px] px-4 flex items-center justify-between bg-darkGray text-[17px] cursor-pointer",
				classNameLabel
			)}
		>
			<span className="text-[17px] select-none">{label}</span>
			<Switch.Root
				// checked={checked}
				// onCheckedChange={() => setChecked((s) => !s)}
				className="w-[51px] h-[31px] bg-gray rounded-full relative data-[state=checked]:bg-blue outline-none"
				style={{ WebkitTapHighlightColor: "rgba(0, 0, 0, 0)" }}
			>
				<Switch.Thumb className="block w-[27px] h-[27px] bg-white md:bg-black rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
			</Switch.Root>
		</div>
	);
}

export default Switcher;
