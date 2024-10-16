import { NavLink, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import AccessIcon from "./access.svg?react";
import ChangeIcon from "./change.svg?react";
import MessagesIcon from "./message.svg?react";
import SettingsIcon from "./settings.svg?react";

function Menu() {
  return (
    <nav className="sticky bottom-0 flex justify-around items-center border-t border-borderColor h-[70px] md:h-[50px] bg-[#242424] md:bg-black">
      <MenuLink path="access" Icon={AccessIcon} />
      <MenuLink path="change" Icon={ChangeIcon} isActive />
      <MenuLink path="chats" Icon={MessagesIcon} isActive />
      <MenuLink path="settings" Icon={SettingsIcon} />
    </nav>
  );
}
export default Menu;

type Props = {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  path: string;
  isActive?: boolean;
};

function MenuLink({ Icon, path, isActive = false }: Props) {
  const active = useLocation().pathname.split("/")[1] === path;

  return (
    <NavLink
      onClick={isActive ? undefined : () => alert("Coming soon")}
      to={isActive ? "/" + path : ""}
      className="flex flex-col items-center gap-2"
    >
      <Icon fill={active ? "#567DFF" : "#676E75"} />
      <span
        className={twMerge(
          active ? "text-blue" : "text-gray",
          "text-xs md:hidden"
        )}
      >
        {path[0].toUpperCase() + path.slice(1)}
      </span>
    </NavLink>
  );
}
