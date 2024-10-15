import { useDispatch, useSelector } from "react-redux";

import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import { IRootState } from "@/stores/rtk";
import { setVerificationPhrase } from "@/stores/slices/exchange";

export const VerificationPhrase = () => {
  const exchangeStore = useSelector((s: IRootState) => s.exchangeSlice);
  const dispatch = useDispatch();

  const onChangeVerificationPhrase = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setVerificationPhrase(e.target.checked));
  };

  return (
    <>
      <Header>
        <BackBtn to=".." />

        <span className="text-lg font-semibold">Verification Phrase</span>

        <EditBtn className="invisible" />
      </Header>

      <div className="max-w-2xl mx-auto py-[35px] gap-[35px]">
        <div className="mb-[6px] ml-[16px] text-gray text-sm">
          VERIFICATION PHRASE
        </div>

        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={exchangeStore.verificationPhrase}
            className="sr-only peer"
            onChange={onChangeVerificationPhrase}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:blue dark:peer-focus:blue rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Use Verification Phrase
          </span>
        </label>
      </div>
    </>
  );
};
