import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { UserAgreementModal } from "@/components/userAgreementModal";
import { ConnectionErrorModal } from "@/components/connectionErrorModal";
import { SocketApi } from "@/socket";

export default function Layout() {
  const [isShownAgreement, setIsShownAgreement] = useState(() => true);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      SocketApi.instances.forEach((i) => i.disconnect());
    };
  }, []);

  useEffect(() => {
    const script = document.createElement("script");

    // TODO
    // script.src = "https://github.com/iammarguuss/hideAlgos/blob/main/main.js";
    script.src = "/scripts/algo.js";
    script.async = true;

    document.head.appendChild(script);

    navigate("/chats");
  }, [navigate]);

  return (
    <div id="layout" className="relative h-full text-white bg-black md:flex">
      <Outlet />

      {isShownAgreement && (
        <div className="absolute inset-0 w-full h-full bg-[#0000004d]">
          <UserAgreementModal setIsShownModal={setIsShownAgreement} />
        </div>
      )}

      <ConnectionErrorModal />
    </div>
  );
}
