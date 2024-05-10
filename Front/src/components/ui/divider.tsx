import { twMerge } from "tailwind-merge";

type Props = {
	className?: string;
	full?: boolean;
};

export default function Divider({ className, full }: Props) {
	return (
		<div
			className={twMerge(
				"ml-4 border-b border-borderColor",
				full && "md:ml-0",
				className
			)}
		/>
	);
}
