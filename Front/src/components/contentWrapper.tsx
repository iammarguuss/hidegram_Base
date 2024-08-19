import { routes } from "@/router";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

function ContentWrapper({ children }: { children: React.ReactNode }) {
  const [width, setWidth] = useState(() => window.innerWidth);
  const location = useLocation().pathname;

  useEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // prettier-ignore
  const isActiveLocation = [...routes[0].children]
		.reduce((acc: string[], cur) =>
				[...acc,cur.children?.map((r: { path: string; }) => r.path.replace(":", ""))].flat(),[])
		.some((s: string) => location.includes(s));

  return (
    <main
      className={twMerge(
        "w-full h-full hidden md:block bg-black",
        width < 768 && "absolute top-0",
        isActiveLocation ? "block" : "hidden"
      )}
    >
      {children}
    </main>
  );
}

export default ContentWrapper;
