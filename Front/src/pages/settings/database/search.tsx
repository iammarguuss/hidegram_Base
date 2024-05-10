import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Scrollable from "@/components/scrollable";
import Divider from "@/components/ui/divider";

function Search() {
	return (
		<>
			<Header>
				<BackBtn />
				<span className="text-lg font-semibold">Database</span>
				<EditBtn className="invisible" />
			</Header>

			<Scrollable className="max-w-2xl mx-auto">
				<div className="bg-darkGray md:rounded-[10px]">
					{Array.from({ length: 25 }, (_, i) => (
						<SearchItem key={i} />
					))}
				</div>
			</Scrollable>
		</>
	);
}
export default Search;

function SearchItem() {
	return (
		<>
			<li className="grid grid-cols-2 px-4 bg-darkGray h-[60px] content-center cursor-pointer hover:bg-hover first:rounded-t-[10px] last-of-type:rounded-b-[10px]">
				<div className="text-[17px]">
					ID: {String(Math.random()).slice(7)}
				</div>
				<div className="justify-self-end text-[13px] text-gray">
					3.01.2024, 3:44 pm
				</div>
				<div className="text-[13px]">Onxiroi</div>
			</li>
			<Divider full className="last:hidden" />
		</>
	);
}
