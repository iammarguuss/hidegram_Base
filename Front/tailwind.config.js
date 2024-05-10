/** @type {import('tailwindcss').Config} */
import formsPlugin from "@tailwindcss/forms";

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		colors: {
			white: "#fff",
			black: "#000",
			blue: "#567dff",
			red: "#eb5545",
			gray: "#6E6E72",
			borderColor: "#232323",
			darkGray: "#1b1b1b",
			hover: "#111",
		},
		extend: {},
	},
	plugins: [formsPlugin],
};
