import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Scrollable from "@/components/scrollable";
import Divider from "@/components/ui/divider";
import Input from "@/components/ui/input";
import { IRootState } from "@/stores/rtk";
import {
  setGeneratedPassword,
  setPassword,
  setPasswordLength,
  setUseCapitalLetters,
  setUseNumbers,
  setUseSpecialCharacters,
} from "@/stores/slices/exchange";
import Switcher from "@/components/ui/switcher";
import Slider from "@/components/ui/slider";
import Button from "@/components/ui/button";

const PassSettings = () => {
  const exchangeStore = useSelector((s: IRootState) => s.exchangeSlice);
  const dispatch = useDispatch();
  const [entropy, setEntropy] = useState<number | null>(null);

  const onChangePasswordType = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setGeneratedPassword(e.target.value === "generated"));
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setPassword(e.target.value));
  };

  const onClearPassword = () => {
    dispatch(setPassword(""));
  };

  const onPasswordLengthChange = (value: number) => {
    dispatch(setPasswordLength(value));
  };

  const onSubmitGenerate = async () => {
    const crypto = new window.SteroidCrypto();
    const passwordInfo = await crypto.ChangePassGen(
      exchangeStore.passwordLength,
      exchangeStore.useCapitalLetters,
      exchangeStore.useNumbers,
      exchangeStore.useSpecialCharacters
    );

    const pass = passwordInfo.r.pass;

    if (pass) {
      dispatch(setPassword(pass));
      setEntropy(passwordInfo.r.entropy);
    }
  };

  return (
    <>
      <Header>
        <BackBtn to=".." />

        <span className="text-lg font-semibold">Password Settings</span>

        <EditBtn className="invisible" />
      </Header>

      <Scrollable className="max-w-2xl mx-auto">
        <div>
          <div className="bg-darkGray md:rounded-[10px]">
            <label className="px-4 py-[24px] flex justify-between h-[58px] items-center bg-darkGray cursor-pointer hover:bg-hover md:rounded-t-[10px]">
              <span className="text-[17px]">Generated</span>

              <input
                type="radio"
                name="language"
                value="generated"
                checked={exchangeStore.generatedPassword}
                onChange={onChangePasswordType}
                className="hidden peer"
              />

              <img
                src="/icon-checkmark.svg"
                alt="check mark icon"
                className="hidden peer-checked:block"
              />
            </label>

            <Divider full />

            <label className="px-4 py-[24px] flex justify-between h-[58px] items-center bg-darkGray cursor-pointer hover:bg-hover md:rounded-b-[10px]">
              <span className="text-[17px]">Defined</span>

              <input
                type="radio"
                name="language"
                value="defined"
                className="hidden peer"
                checked={!exchangeStore.generatedPassword}
                onChange={onChangePasswordType}
              />

              <img
                src="/icon-checkmark.svg"
                alt="check mark icon"
                className="hidden peer-checked:block"
              />
            </label>
          </div>
        </div>

        {exchangeStore.generatedPassword ? (
          <>
            <div className="w-full max-w-2xl mx-auto">
              <p className="text-gray mb-[6px] px-4 text-sm">CHARACTERS</p>

              <div className="h-[50px] px-4 flex items-center gap-[14px]  bg-darkGray md:rounded-[10px]">
                <span>16</span>

                <Slider
                  min={16}
                  max={64}
                  value={exchangeStore.passwordLength}
                  setValue={onPasswordLengthChange}
                />
                <span>{exchangeStore.passwordLength}</span>
              </div>

              <p className="mt-[9px] text-gray mb-[6px] px-4 text-sm">
                Password length.
              </p>
            </div>

            <div className="w-full max-w-2xl mx-auto">
              <p className="mb-[6px] pl-4 text-sm text-gray">
                Additional settings
              </p>

              <div className="bg-darkGray md:rounded-[10px]">
                <Switcher
                  label="Use Special Characters"
                  classNameLabel="md:rounded-t-[10px]"
                  checked={exchangeStore.useSpecialCharacters}
                  onChange={(v) => dispatch(setUseSpecialCharacters(v))}
                />

                <Divider full />

                <Switcher
                  label="Use Capital Letters A-Z"
                  checked={exchangeStore.useCapitalLetters}
                  onChange={(v) => dispatch(setUseCapitalLetters(v))}
                />

                <Divider full />

                <Switcher
                  label="Use Numbers 0-9"
                  classNameLabel="md:rounded-b-[10px]"
                  checked={exchangeStore.useNumbers}
                  onChange={(v) => dispatch(setUseNumbers(v))}
                />
              </div>
            </div>

            <Button onClick={onSubmitGenerate}>Apply</Button>

            {exchangeStore.password && (
              <div className="bg-darkGray md:rounded-[10px] p-4">
                <div>Password: {exchangeStore.password}</div>
              </div>
            )}

            {entropy && (
              <div className="bg-darkGray md:rounded-[10px] p-4">
                <div className="mt-[9px]">Entropy: {entropy.toFixed(0)}</div>
                <p className="mt-[2px] text-gray mb-[6px] text-sm">
                  number for entropy (if more then 100 is good)
                </p>
              </div>
            )}
          </>
        ) : (
          <div>
            <div className="mb-[6px] ml-[16px] text-gray text-sm">
              DEFINED PASSWORD
            </div>

            <div className="bg-darkGray flex md:rounded-[10px]">
              <Input
                className="text-gray md:rounded-[10px]"
                iconEye
                value={exchangeStore.password}
                onChange={onPasswordChange}
              />

              {exchangeStore.password.length > 0 && (
                <img
                  src="/x-icon.svg"
                  alt="show password icon"
                  className="mr-4"
                  onClick={onClearPassword}
                />
              )}
            </div>

            <div className="px-4 text-sm text-gray mt-[9px]">
              Turn this off if you want to receive notifications only from your
              active account.
            </div>
          </div>
        )}
      </Scrollable>
    </>
  );
};

export default PassSettings;
