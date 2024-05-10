import { twMerge } from "tailwind-merge";

type Props = React.ComponentProps<"ul"> & {
	children: React.ReactNode;
	className?: string;
};

function Scrollable({ children, className, ...props }: Props) {
	return (
		<ul
			{...props}
			className={twMerge(
				"h-[calc(100%-54px)] md:h-[calc(100%-60px)] py-[35px] flex flex-col gap-[35px]",
				className
			)}
		>
			{children}
		</ul>
	);
}

export default Scrollable;
