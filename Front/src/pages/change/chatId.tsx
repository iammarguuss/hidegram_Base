import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Input from "@/components/ui/input";
import { IRootState } from "@/stores/rtk";
import { setChatId } from "@/stores/slices/exchange";
import { useDispatch, useSelector } from "react-redux";

const ChatId = () => {
  const exchangeStore = useSelector((s: IRootState) => s.exchangeSlice);
  const dispatch = useDispatch();

  const onChatIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    if (value > 0 && value <= 1000) {
      dispatch(setChatId(value));
    }
  };

  return (
    <>
      <Header>
        <BackBtn to=".." />
        <span className="text-lg font-semibold">Chat ID</span>
        <EditBtn className="invisible" />
      </Header>

      <div className="max-w-2xl mx-auto py-[35px] gap-[35px]">
        <div className="mb-[6px] ml-[16px] text-gray">CHAT ID</div>

        <div className="bg-darkGray flex md:rounded-[10px]">
          <Input
            type="number"
            max={1000}
            className="text-gray md:rounded-[10px]"
            value={exchangeStore.chatId}
            onChange={onChatIdChange}
          />

          <img src="/x-icon.svg" alt="show password icon" className="mr-4" />
        </div>
      </div>
    </>
  );
};

export default ChatId;
