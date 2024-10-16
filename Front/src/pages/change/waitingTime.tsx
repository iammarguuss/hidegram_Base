import { useDispatch, useSelector } from "react-redux";

import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Slider from "@/components/ui/slider";
import { IRootState } from "@/stores/rtk";
import { setWaitingTime } from "@/stores/slices/exchange";

const WaitingTime = () => {
  const exchangeStore = useSelector((s: IRootState) => s.exchangeSlice);
  const dispatch = useDispatch();

  const onWaitingTimeChange = (value: number) => {
    dispatch(setWaitingTime(value));
  };

  return (
    <>
      <Header>
        <BackBtn to=".." />
        <span className="text-lg font-semibold">Waiting Time</span>
        <EditBtn className="invisible" />
      </Header>

      <div className="max-w-2xl mx-auto py-[35px] gap-[35px]">
        <div className="mb-[6px] ml-[16px] text-gray text-sm">WAITING TIME</div>

        <div className="h-[50px] px-4 flex items-center gap-[14px]  bg-darkGray md:rounded-[10px]">
          <span>1</span>

          <Slider
            min={1}
            max={1440}
            value={exchangeStore.waitingTime}
            setValue={onWaitingTimeChange}
          />
          <span className="min-w-20 text-right">{exchangeStore.waitingTime} min</span>
        </div>
      </div>
    </>
  );
};

export default WaitingTime;
