import { twMerge } from "tailwind-merge";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	className?: string;
};

function Textarea({ className, ...props }: Props) {
	return (
		<textarea
			{...props}
			className={twMerge(
				"w-full px-4 py-3 text-[17px] bg-darkGray md:rounded-[10px] outline-none resize-none overflow-hidden placeholder:text-gray border-none focus:ring-0",
				className
			)}
		/>
	);
}

export default Textarea;
