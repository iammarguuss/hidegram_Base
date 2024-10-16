import { useDispatch } from "react-redux";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Input from "@/components/ui/input";
import Header from "@/components/header";
import Scrollable from "@/components/scrollable";
import Button from "@/components/ui/button";
import { SocketApi } from "@/socket";
import { setMessagesByChatId } from "@/stores/slices/chat.js";
import { randomChatId } from "@/utils/helpers";

const NewChat: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [chatId, setChatId] = useState<number | null>(null);

  const handleConnect = async ({ id }: { id: string }) => {
    const crypto = new window.SteroidCrypto();
    const skey = await crypto.getSkey(password);
    const roomId = id;
    const newChat = {
      id: roomId,
      name,
      data: [],
      unreadMessages: 0,
      nickname,
      skey,
      chatId: chatId!,
      password,
      roomId,
      timestamp: Date.now(),
    };

    dispatch(setMessagesByChatId(newChat));
    navigate(`/chats/${roomId}`);
  };

  const onConnect = async () => {
    const crypto = new window.SteroidCrypto();
    const skey = await crypto.getSkey(password);
    const newChatId = chatId || randomChatId();

    if (!chatId) {
      setChatId(newChatId);
    }

    const socket = SocketApi.createConnection({ chatId: newChatId, skey });
    socket.on("onConnect", handleConnect);
  };

  return (
    <>
      <Header>
        <BackBtn />
        <span className="text-lg font-semibold">New Chat</span>
        <EditBtn />
      </Header>

      <Scrollable>
        <div className="w-full max-w-2xl mx-auto">
          <div className="px-4 text-sm text-gray mb-[6px]">MY NICKNAME</div>
          <Input
            placeholder="Enter Your Nickname"
            className="md:rounded-[10px] text-[17px] mb-[9px]"
            value={nickname}
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
              setNickname(target.value)
            }
          />
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <div className="px-4 text-sm text-gray mb-[6px]">PASSWORD</div>
          <Input
            placeholder="Enter Your Master Password"
            className="md:rounded-[10px] text-[17px] mb-[9px]"
            iconEye
            value={password}
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(target.value)
            }
          />
          <div className="px-4 text-sm text-gray">
            If you change your password, your messages recipient must also
            change it to suspect the conversation.
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <div className="px-4 text-sm text-gray mb-[6px]">CHAT HEADER</div>
          <Input
            placeholder="Enter Your Chat Header"
            className="md:rounded-[10px] text-[17px] mb-[9px]"
            value={name}
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
              setName(target.value)
            }
          />
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <div className="px-4 text-sm text-gray mb-[6px]">CHAT ID</div>
          <Input
            placeholder="Enter the chat ID for an existing chat or leave empty for a new chat"
            className="md:rounded-[10px] text-[17px] mb-[9px]"
            value={chatId || ""}
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
              setChatId(parseInt(target.value))
            }
          />
        </div>

        {/* 
				<div className="w-full max-w-2xl mx-auto">
					<div className="px-4 text-sm text-gray mb-[6px]">
						CHAT FILTER
					</div>
					<Switcher
						label="I Saved My Password"
						classNameLabel="mb-[9px] md:rounded-[10px]"
					/>
					<div className="px-4 text-sm text-gray">
						Enter a few words so the sender can be sure that you
						received the code.
					</div>
				</div> */}

        <Button onClick={onConnect}>Connect to Chat</Button>
      </Scrollable>
    </>
  );
};

export default NewChat;

// TODO connect from git
declare global {
  interface Constructable<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any): T;
  }

  /**
   * public and private keys
   * @typedef {Object} KeyPairsResponse
   * @property {base64} publicKey - base 64 from the key
   * @property {base64} privateKey - base 64 from the key
   */
  interface IKeyPairsResponse {
    publicKey: string;
    privateKey: string;
  }

  /**
   * genPair response
   * @property {boolean} s - status: true if it was successful
   * @property {string|null} e - error message IF error exist
   * @property {KeyPairsResponse|null} e - KeyPairsResponse or if error => null
   */
  interface IGenPairResponse {
    s: boolean;
    e: string | null;
    r: IKeyPairsResponse;
  }

  interface ICreatePackageResponseBody {
    publicKey: string;
    originSha: string;
    signature: string;
  }

  interface ICreatePackageResponse {
    s: boolean;
    e: string | null;
    salt: string;
    r: ICreatePackageResponseBody;
  }

  interface IPrevalidatorResponse {
    s: boolean;
    e: string | null;
    r: ICreatePackageResponseBody;
  }

  interface IRSAResponseBody {
    sha512: string;
    encryptedAesString: string;
  }

  interface IRSAResponse {
    s: boolean;
    e: string | null;
    r: IRSAResponseBody;
    aes: string; // aes string for encryption => MUST BE SAVED LOCALLY
  }

  interface IPasswordBody {
    pass: string;
    chatID: number;
  }

  interface IEncryptDataResponseBody {
    password: string;
    salt: number;
  }

  interface IEncryptDataResponse {
    s: boolean;
    e: string | null;
    phrase: string;
    aes: string; // aes string for encryption => MUST BE SAVED LOCALLY
    r: IEncryptDataResponseBody;
  }

  interface IFinalAccepterResponseBody {
    finalKey: { chatID: number, pass: string }; // the password with all the settings from change, received SHOULD BE SAVED LOCALLY and to chat with it
    signature: string; // hex. should send to sender before clothing connection. the only one, that should be sent back and its over
  }

  interface IFinalAccepterResponse {
    s: boolean;
    e: string | null;
    r: IFinalAccepterResponseBody;
  }

  interface ILastCheckResponse {
    s: boolean;
    e: string | null;
    r: boolean;
  }

  interface IGenPasswordResponse {
    s: boolean;
    e: string | null;
    r: {
      pass: string | null;
      entropy: number; // number for entropy (if more then 100 is => good)
    };
  }

  interface ISteroidCrypto {
    getSkey: (value: string) => number;
    getPass: (value: string) => string;
    messageEnc: (
      text: string,
      password: string,
      isEncrypt: boolean,
      algo?: number
    ) => {
      s: number;
      t: string;
      v: number;
    };

    /**
     * Generates Key Pair for RSA
     * @param {string} keySize - *bitKeySize => 4k by default
     * @returns {IGenPairResponse}
     */
    genPair: (keySize?: number) => IGenPairResponse;

    /**
     * Generates Key Pair for RSA
     * @param {string} publicKeyBase64 - publicKey: base 64 from the key
     * @param {string} hexString - signature from server in hex
     * @returns {ICreatePackageResponse}
     */
    createPackage: (
      publicKeyBase64: string,
      hexString: string,
      valicationPhrase?: boolean,
      waitingTime?: number
    ) => ICreatePackageResponse;

    /**
     * Checks if all the data is correct when received
     * @param {ICreatePackageResponseBody} packet - response body from createPackage
     * @param {string} inputString - hex 64 char original string from the server
     * @returns {IPrevalidatorResponse}
     */
    prevalidator: (
      packet: ICreatePackageResponseBody,
      inputString: string
    ) => IPrevalidatorResponse;

    /**
     * Checks if all the data is correct when received
     * @param {ICreatePackageResponseBody} packet - response body from createPackage
     * @param {string} inputString - hex 64 char original string from the server
     * @returns {IRSAResponse}
     */
    responceRSA: (
      packet: ICreatePackageResponseBody,
      inputString: string,
      validationPhrase: string,
    ) => IRSAResponse;

    /**
     * decrypts message, checks signatures and make the package to send it back.
     * @param {IRSAResponseBody} packet - response body from createPackage
     * @param {string} inputString - hex 64 char original string from the server
     * @param {string} signatureSha256 - sha string from the server (should be from localstorage)
     * @param {string} privateKeyBase64 - private key in base64
     * @param {string} publicKeyBase64 - public key in base64
     * @param {IPasswordBody} password - object with password from change settings
     * @param {string} salt - salt from createPackage.salt
     * @returns {IEncryptDataResponse}
     */
    encryptData: (
      packet: IRSAResponseBody,
      inputString: string,
      signatureSha256: string,
      privateKeyBase64: string,
      publicKeyBase64: string,
      password: IPasswordBody,
      salt: string
    ) => IEncryptDataResponse;

    /**
     * very last method from the receiver side before chat
     * @param {IEncryptDataResponseBody} packet - response body from createPackage
     * @param {string} inputString - hex 64 char original string from the server
     * @param {string} signatureSha256 - sha string from the server (should be from localstorage)
     * @param {string} privateKeyBase64 - private key in base64
     * @param {string} publicKeyBase64 - public key in base64
     * @param {IPasswordBody} password - object with password from change settings
     * @param {string} salt - salt from createPackage.salt
     * @returns {IRSAResponse}
     */
    finalAccepter: (
      packet: IEncryptDataResponseBody,
      signatureSha256: string,
      publicKeyBase64: string,
      hexString: string,
      aesKeyHex: string
    ) => IFinalAccepterResponse;

    /**
     * last salt validation
     * @param {string} signature - finalAccepter.r.signature
     * @param {string} signature_old - old salt from local storage
     * @returns {IRSAResponse}
     */
    lastCheck: (signature: string, signature_old: string) => ILastCheckResponse;

    ChangePassGen: (
      length: number, //     - password length
      Cap: boolean, //     - Capital letters A-Z
      num: boolean, //     - Numbers 0-9
      sch: boolean //     - special chars
    ) => IGenPasswordResponse;
  }

  interface Window {
    SteroidCrypto: Constructable<ISteroidCrypto>;
  }
}
