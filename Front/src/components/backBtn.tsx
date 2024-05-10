import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

type Props = React.ComponentProps<"button"> & {
	className?: string;
	to?: string | number;
};

function BackBtn({ className, to = -1, ...props }: Props) {
	const navigate = useNavigate();

	if (window.innerHeight < 768) {
		to = -1;
	}

	return (
		<button
			className={twMerge(
				"w-[60px] flex items-center gap-2 text-[17px] text-blue",
				className
			)}
			onClick={() => navigate(to as never)}
			{...props}
		>
			<img src="/arrow-left.svg" alt="arrow left icon" />
			<span>Back</span>
		</button>
	);
}

export default BackBtn;
