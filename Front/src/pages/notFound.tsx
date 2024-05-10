import { Link } from "react-router-dom";

function NotFound() {
	return (
		<div className="grid h-full gap-2 place-content-center">
			<h1 className="text-5xl">404 Not Found</h1>
			<Link to="/chats" className="flex justify-center">
				<button>Back to Messages</button>
			</Link>
		</div>
	);
}

export default NotFound;
