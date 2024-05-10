import Divider from "@/components/ui/divider";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

type Props = {
	isEdit: boolean;
	id: string;
	title: string;
};
function AccessItem({ isEdit, id, title }: Props) {
	return (
		<>
			<Wrapper isEdit={isEdit} id={id}>
				<div className="flex">
					{isEdit && (
						<div className="row-span-2 mr-4 place-self-center">
							<input
								type="checkbox"
								value={id}
								// onChange={checkboxChange}
								className="rounded-full bg-darkGray text-blue size-5 focus:ring-offset-0 focus:ring-0"
							/>
						</div>
					)}
					<div className="flex flex-col">
						<span className="text-[17px] text-left">{title}</span>
						<span className="text-[13px] text-gray">ID: {id}</span>
					</div>
				</div>
				<img src="/arrow-right.svg" alt="arrow left icon" />
			</Wrapper>
			<Divider className="last:hidden" />
		</>
	);
}
export default AccessItem;

type WrapperProps = {
	children: React.ReactNode;
	isEdit: boolean;
	id: string;
};
function Wrapper({ children, isEdit, id }: WrapperProps) {
	if (isEdit) {
		return (
			<label
				className={twMerge(
					"w-full h-[58px] px-4 flex justify-between items-center hover:bg-hover first-of-type:rounded-t-[10px] last-of-type:rounded-b-[10px]"
				)}
			>
				{children}
			</label>
		);
	}

	return (
		<NavLink
			to={`/access/data-${id}`}
			className="w-full h-[58px] px-4 flex justify-between items-center hover:bg-hover first-of-type:rounded-t-[10px] last-of-type:rounded-b-[10px]"
		>
			{children}
		</NavLink>
	);
}
