import { FC } from "react";

import Button from "./ui/button";
import { BaseModal } from "./baseModal";

interface IUserAgreementModalProps {
  setIsShownModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserAgreementModal: FC<IUserAgreementModalProps> = (props) => {
  const { setIsShownModal } = props;

  return (
    <BaseModal
      setIsShownModal={setIsShownModal}
      body={
        <>
          <p className="mb-6 text-2xl font-bold">User Agreement</p>
          {import.meta.env.MODE === "prod" ? (
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              You agree that we do not know who you are or what you do. We do
              not store any information about you, except what you write in our
              chat. Also, we are in an early version, so more features will be
              coming soon.
            </p>
          ) : (
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              This is test version of the app. You are not welcome here :)
            </p>
          )}
        </>
      }
      footer={
        <Button
          onClick={() => setIsShownModal((s) => !s)}
          className="md:w-[180px] m-0 md:text-center text-white bg-blue hover:bg-blue hover:bg-opacity-80 rounded-[10px]"
        >
          I Agree
        </Button>
      }
    />
  );
};
