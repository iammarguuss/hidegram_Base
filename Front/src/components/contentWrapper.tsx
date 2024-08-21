import { routes } from "@/router";
import { FC, ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface IContentWrapperProps {
  children: ReactNode;
  showContent?: boolean;
}
const ContentWrapper: FC<IContentWrapperProps> = (props) => {
  const { children, showContent } = props;

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
  const isActiveLocation = showContent === true || [...routes[0].children]
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
};

export default ContentWrapper;
