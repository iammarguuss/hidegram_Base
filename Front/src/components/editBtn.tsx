import { twMerge } from "tailwind-merge";

type Props = React.ComponentProps<"button"> & {
	children?: React.ReactNode;
	className?: string;
};

function EditBtn({ children, className, ...props }: Props) {
	return (
		<button
			{...props}
			className={twMerge(
				"w-[60px] text-[17px] text-right text-blue",
				className
			)}
		>
			{children || "Edit"}
		</button>
	);
}

export default EditBtn;
