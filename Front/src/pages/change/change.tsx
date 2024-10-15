import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useSelector } from "react-redux";

import BackBtn from "@/components/backBtn";
import ContentWrapper from "@/components/contentWrapper";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Menu from "@/components/menu/menu";
import Scrollable from "@/components/scrollable";
import SidebarWrapper from "@/components/sidebarWrapper";
import Divider from "@/components/ui/divider";
import Input from "@/components/ui/input";
import { IRootState } from "@/stores/rtk";
import { convertMinsToHrsMins } from "@/utils/helpers";

const Change = () => {
  const exchangeStore = useSelector((s: IRootState) => s.exchangeSlice);
  const [isSend, setIsSend] = useState(true);

  return (
    <>
      <SidebarWrapper>
        <Header>
          <BackBtn className="invisible" />
          <div className="flex items-center justify-center h-[30px]">
            <button
              className={`min-w-[85px] h-[30px] rounded-l-[10px] text-[13px] border border-blue whitespace-nowrap ${
                isSend && "bg-blue"
              }`}
              onClick={() => setIsSend((s) => s || !s)}
            >
              To Send
            </button>
            <button
              className={`min-w-[85px] h-[30px] rounded-r-[10px] text-[13px] border border-blue whitespace-nowrap ${
                !isSend && "bg-blue"
              }`}
              onClick={() => setIsSend((s) => s && !s)}
            >
              To Get
            </button>
          </div>
          <EditBtn className="invisible" />
        </Header>

        {isSend && (
          <Scrollable className="h-[calc(100%-124px)] md:h-[calc(100%-110px)] md:px-4">
            <div className="bg-darkGray md:rounded-[10px]">
              <NavLink
                to="/change/password-settings"
                className={twMerge(
                  "relative h-[50px] px-[14px] flex justify-between items-center md:rounded-t-[10px] hover:bg-hover cursor-pointer"
                )}
              >
                <p className="text-[17px]">Passwords Settings</p>
                <p className="text-[17px] text-gray mr-[18px]">
                  {exchangeStore.generatedPassword ? "Generated" : "Defined"}
                </p>
                <img
                  src="/arrow-right.svg"
                  alt="arrow left icon"
                  className="absolute -translate-y-1/2 right-4 top-1/2"
                />
              </NavLink>
              <Divider full />

              {/* <NavLink
              // TODO remove component
                to="/change/exchange-method"
                className={twMerge(
                  "relative h-[50px] px-[14px] flex justify-between items-center hover:bg-hover md:rounded-b-[10px] cursor-pointer"
                )}
              >
                <p className="text-[17px]">Exchange Method</p>
                <p className="text-[17px] text-gray mr-[18px]">Link</p>
                <img
                  src="/arrow-right.svg"
                  alt="arrow left icon"
                  className="absolute -translate-y-1/2 right-4 top-1/2"
                />
              </NavLink> */}
            </div>

            <div className="bg-darkGray md:rounded-[10px]">
              <NavLink
                to="/change/password-exchange"
                className={twMerge(
                  "relative h-[50px] px-[14px] flex justify-between items-center md:rounded-t-[10px] hover:bg-hover cursor-pointer"
                )}
              >
                <p className="text-[17px] line-clamp-1">Password to Exchange</p>

                <p className="text-[17px] text-gray mr-[18px]">
                  {`${exchangeStore.password.slice(0, 3)} ...`}
                </p>

                <img
                  src="/arrow-right.svg"
                  alt="arrow left icon"
                  className="absolute -translate-y-1/2 right-4 top-1/2"
                />
              </NavLink>
              <Divider full />

              <NavLink
                to="/change/waiting-time"
                className={twMerge(
                  "relative h-[50px] px-[14px] flex justify-between items-center hover:bg-hover cursor-pointer"
                )}
              >
                <p className="text-[17px]">Waiting Time</p>

                <p className="text-[17px] text-gray mr-[18px]">
                  {convertMinsToHrsMins(exchangeStore.waitingTime)}
                </p>

                <img
                  src="/arrow-right.svg"
                  alt="arrow left icon"
                  className="absolute -translate-y-1/2 right-4 top-1/2"
                />
              </NavLink>

              <Divider full />

              <NavLink
                to="/change/chat-id"
                className={twMerge(
                  "relative h-[50px] px-[14px] flex justify-between items-center hover:bg-hover cursor-pointer"
                )}
              >
                <p className="text-[17px]">Chat ID</p>

                <p className="text-[17px] text-gray mr-[18px]">
                  {exchangeStore.chatId}
                </p>

                <img
                  src="/arrow-right.svg"
                  alt="arrow left icon"
                  className="absolute -translate-y-1/2 right-4 top-1/2"
                />
              </NavLink>

              <Divider full />

              <NavLink
                to="/change/verification-phrase"
                className={twMerge(
                  "relative h-[50px] px-[14px] flex justify-between items-center hover:bg-hover md:rounded-b-[10px] cursor-pointer"
                )}
              >
                <p className="text-[17px]">Verification Phrase</p>

                <p className="text-[17px] text-gray mr-[18px]">
                  {exchangeStore.verificationPhrase ? "enabled" : "disabled"}
                </p>

                <img
                  src="/arrow-right.svg"
                  alt="arrow left icon"
                  className="absolute -translate-y-1/2 right-4 top-1/2"
                />
              </NavLink>
            </div>

            <NavLink
              to="/change/exchange"
              className="w-full h-[44px] flex items-center text-blue justify-center bg-darkGray md:rounded-[10px] mx-auto"
            >
              Exchange
            </NavLink>
          </Scrollable>
        )}

        {!isSend && (
          <Scrollable className="h-[calc(100%-124px)] md:h-[calc(100%-110px)] md:px-4">
            <div>
              <div className="mb-[6px] ml-[16px] text-gray text-sm">
                EXCHANGE CODE
              </div>
              <div className="bg-darkGray flex md:rounded-[10px]">
                <Input type="text" className="md:rounded-[10px]" />
                <img
                  src="/x-icon.svg"
                  alt="show password icon"
                  className="mr-4 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <div className="mb-[6px] ml-[16px] text-gray text-sm">
                EXCHANGE CODE
              </div>
              <div className="bg-darkGray flex md:rounded-[10px]">
                <Input
                  type="text"
                  placeholder="Optional"
                  className="md:rounded-[10px]"
                />
              </div>
              <div className="px-4 text-sm text-gray mt-[9px]">
                Enter a few words so the sender can be sure that you received
                the code.
              </div>
            </div>

            <NavLink
              to="/change/exchange"
              className="w-full h-[44px] flex items-center text-blue justify-center bg-darkGray md:rounded-[10px] mx-auto"
            >
              Exchange
            </NavLink>
          </Scrollable>
        )}
        <Menu />
      </SidebarWrapper>

      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </>
  );
};

export default Change;
