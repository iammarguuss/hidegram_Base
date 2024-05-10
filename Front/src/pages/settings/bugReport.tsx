import Header from "@/components/header";
import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Scrollable from "@/components/scrollable";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";

function BugReport() {
	return (
		<>
			<Header>
				<BackBtn to=".." />
				<span className="text-lg font-semibold">Feedback</span>
				<EditBtn className="invisible" />
			</Header>

			<Scrollable className="max-w-2xl mx-auto">
				<div className="text-[14px] text-gray text-center">
					WARNING: Push Notifications are disabled. To enable visit:
					<br />
					iPhone Settings &gt; Notifications &gt; WhatsApp
				</div>

				<div className="w-full max-w-2xl mx-auto">
					<div className="px-4 text-sm text-gray mb-[6px]">
						NUMBER
					</div>
					<Input
						type="text"
						placeholder="Text Field"
						className="md:rounded-[10px] text-[17px] mb-[9px]"
					/>
					<div className="px-4 text-sm text-gray">
						Turn this off if you want to receive notifications only
						from your active account.
					</div>
				</div>

				<div className="w-full max-w-2xl mx-auto">
					<div className="px-4 text-sm text-gray mb-[6px]">
						NUMBER
					</div>
					<Input
						type="text"
						placeholder="Text Field"
						className="md:rounded-[10px] text-[17px] mb-[9px]"
					/>
					<div className="px-4 text-sm text-gray">
						Turn this off if you want to receive notifications only
						from your active account.
					</div>
				</div>

				<div className="w-full max-w-2xl mx-auto">
					<div className="px-4 text-sm text-gray mb-[6px]">
						NUMBER
					</div>
					<Textarea
						placeholder="Write Your Feedback"
						className="h-[200px] md:h-[400px]"
					/>
				</div>

				<Button>Send</Button>
			</Scrollable>
		</>
	);
}

export default BugReport;
BugReport;
