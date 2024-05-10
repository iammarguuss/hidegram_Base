import { twMerge } from "tailwind-merge";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children: React.ReactNode;
	className?: string;
};

function Button({ children, className, ...props }: Props) {
	return (
		<button
			{...props}
			className={twMerge(
				"max-w-2xl min-h-[44px] w-full mx-auto px-4 md:rounded-[10px] md:text-left text-blue bg-darkGray hover:bg-hover",
				className
			)}
		>
			{children}
		</button>
	);
}

export default Button;
