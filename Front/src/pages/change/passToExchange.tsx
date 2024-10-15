import { useSelector } from "react-redux";

import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Scrollable from "@/components/scrollable";
import { IRootState } from "@/stores/rtk";

const PassToExchange = () => {
  const exchangeStore = useSelector((s: IRootState) => s.exchangeSlice);

  return (
    <>
      <Header>
        <BackBtn to=".." />

        <span className="text-lg font-semibold">Password To Exchange</span>

        <EditBtn className="invisible" />
      </Header>

      <Scrollable>
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-darkGray md:rounded-[10px] p-4">
            <div>{exchangeStore.password}</div>
          </div>
        </div>
      </Scrollable>
    </>
  );
};

export default PassToExchange;
