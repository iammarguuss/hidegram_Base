import React, { FC } from "react";
import { twMerge } from "tailwind-merge";

interface IBaseModalProps {
  body: React.ReactNode;
  footer?: React.ReactNode;
  showCloseIcon?: boolean;
  setIsShownModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BaseModal: FC<IBaseModalProps> = (props) => {
  const { body, footer, showCloseIcon = true, setIsShownModal } = props;
  const isMobile = window.innerWidth < 768;

  return (
    <div
      className={twMerge(
        "absolute bg-darkGray max-w-3xl",
        "px-4 py-6 md:py-9 md:px-10 rounded-t-[10px] md:rounded-2xl",
        isMobile
          ? "bottom-0 w-full h-5/6 flex flex-col justify-between"
          : "top-1/3 left-1/2 -translate-x-1/2 w-1/2"
      )}
    >
      {showCloseIcon && (
        <div
          onClick={() => setIsShownModal?.((s) => !s)}
          className="absolute cursor-pointer top-3 right-3"
        >
          <img src="/x-icon-dark.svg" alt="x icon" className="size-6" />
        </div>
      )}

      <div className="md:mb-6">{body}</div>

      <div className="flex flex-col justify-end md:flex-row">{footer}</div>
    </div>
  );
};
