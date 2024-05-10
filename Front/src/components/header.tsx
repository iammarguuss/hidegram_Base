import { twMerge } from "tailwind-merge";

type Props = React.ComponentProps<"header"> & {
	className?: string;
};

function Header({ children, className, ...props }: Props) {
	const isMobile = window.innerWidth < 768;

	return (
		<header
			className={twMerge(
				"h-[54px] md:h-[60px] flex justify-between items-center",
				isMobile
					? "px-[14px] bg-darkGray"
					: "px-4 bg-black border-b border-borderColor",
				className
			)}
			{...props}
		>
			{children}
		</header>
	);
}

export default Header;
