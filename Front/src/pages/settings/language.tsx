import Header from "@/components/header";
import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Scrollable from "@/components/scrollable";
import Divider from "@/components/ui/divider";

const languages = [
	{ title: "English", description: "English" },
	{ title: "Arabic", description: "العربية" },
	{ title: "Catalan", description: "Català" },
	{ title: "Dutch", description: "Nederlands" },
	{ title: "French", description: "Français" },
	{ title: "German", description: "Deutsch" },
	{ title: "Indonesian", description: "Bahasa Indonesia" },
	{ title: "Italian", description: "Italiano" },
	{ title: "Korean", description: "한국어" },
	{ title: "Malay", description: "Bahasa Melayu" },
	{ title: "Persian", description: "فارسی" },
];

function Language() {
	return (
		<>
			<Header className="bg-black">
				<BackBtn to=".." />
				<span className="text-lg font-semibold">Language</span>
				<EditBtn className="invisible" />
			</Header>

			<Scrollable className="max-w-2xl gap-2 mx-auto py-[7px] md:py-[35px]">
				<div className="md:bg-darkGray md:rounded-[10px]">
					{languages.map((lang) => (
						<LangItem key={lang.title} {...lang} />
					))}
				</div>
			</Scrollable>
		</>
	);
}
export default Language;

function LangItem(props: (typeof languages)[0]) {
	return (
		<>
			<label className="h-[58px] px-4 flex justify-between items-center cursor-pointer">
				<div className="flex flex-col">
					<span className="text-[17px]">{props.title}</span>
					<span className="text-[13px]">{props.description}</span>
				</div>
				<input
					type="radio"
					name="language"
					defaultChecked={props.title === "English"}
					value={props.title.toLowerCase()}
					// onChange={(e) => {
					// 	console.log(e.target.value);
					// }}
					className="hidden peer"
				/>
				<img
					src="/icon-checkmark.svg"
					alt="check mark icon"
					className="hidden peer-checked:block"
				/>
			</label>
			<Divider full className="last:hidden" />
		</>
	);
}
