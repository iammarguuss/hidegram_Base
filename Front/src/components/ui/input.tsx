import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
	className?: string;
	iconEye?: boolean;
};

function Input({ className, iconEye, ...props }: Props) {
	const [isPassword, setIsPassword] = useState(iconEye);

	return (
		<div className="relative w-full">
			<input
				{...props}
				type={isPassword ? "password" : "text"}
				className={twMerge(
					"h-[50px] w-full px-4 bg-darkGray caret-blue outline-none placeholder:text-gray border-none focus:ring-0",
					(iconEye || iconEye) && "pr-11",
					className
				)}
			/>
			<div className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2">
				{iconEye && (
					<img
						src="/show-password.svg"
						alt="x icon"
						onClick={() => setIsPassword((s) => !s)}
					/>
				)}
			</div>
		</div>
	);
}

export default Input;
