import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Agreement from "@/components/agreement";

export default function Layout() {
	const [isShownAgreement, setIsShownAgreement] = useState(() => true);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	useEffect(() => {
		const script = document.createElement("script");

		script.src = "/scripts/algo.js";
		script.async = true;
	
		document.body.appendChild(script);
		window.algo = script;

		navigate("/chats");
	}, [navigate]);

	return (
		<div
			id="layout"
			className="relative h-full text-white bg-black md:flex"
		>
			<Outlet />

			{isShownAgreement && pathname === "/access/signup" && (
				<div className="absolute inset-0 w-full h-full bg-[#0000004d]">
					<Agreement setIsShownAgreement={setIsShownAgreement} />
				</div>
			)}
		</div>
	);
}
