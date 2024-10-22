import BackBtn from "@/components/backBtn";
import { BaseModal } from "@/components/baseModal";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Button from "@/components/ui/button";
import Divider from "@/components/ui/divider";
import { Spinner } from "@/components/ui/spinner";
import { LinkSocketApi } from "@/link.socket";
import { SocketApi } from "@/socket";
import { IRootState } from "@/stores/rtk";
import { setMessagesByChatId } from "@/stores/slices/chat";
import { getFromSession, storeInSession } from "@/utils/helpers";
import { customAlphabet } from "nanoid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

const nanoid = customAlphabet("1234567890abcdef", 16);

// Constants
const PREFIX = "crypto_";
const SALT_KEY = `${PREFIX}salt_`;
const SIGNATURE_KEY = `${PREFIX}signature_`;
const PRIVATE_KEY = `${PREFIX}privateKey_`;
const PUBLIC_KEY = `${PREFIX}publicKey_`;

const Exchange = () => {
  const exchangeStore = useSelector((s: IRootState) => s.exchangeSlice);
  const [keyPairs, setKeyPairs] = useState<IKeyPairsResponse | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");
  const [lastCheckSuccess, setLastCheckSuccess] = useState(false);
  const [isShownPublicModal, setIsShownPublicModal] = useState(false);
  const [isShownPrivateModal, setIsShownPrivateModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [encryptionResult, setEncryptionResult] = useState<
    IEncryptDataResponse | undefined
  >();
  const [hStringSHA, setHStringSHA] = useState<string>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLastCheck = async (props: { signature: string }) => {
    const { signature } = props;
    const salt = getFromSession(`${SALT_KEY}${link}`);

    if (salt) {
      const crypto = new window.SteroidCrypto();
      const checkResult = await crypto.lastCheck(signature, salt);

      setLastCheckSuccess(checkResult.s);
    }
  };

  const onHandleResult = async (data: {
    e?: string;
    result: { hexStringSHA: string; hexString: string };
  }) => {
    const crypto = new window.SteroidCrypto();

    if (data.e) {
      throw new Error(data.e);
    }

    const { hexStringSHA } = data.result;

    const keyPairResult = await crypto.genPair();

    setKeyPairs(keyPairResult.r);

    const packageResult = await crypto.createPackage(
      keyPairResult.r.publicKey,
      hexStringSHA,
      !!exchangeStore.verificationPhrase,
      exchangeStore.waitingTime
    );

    storeInSession(`${SALT_KEY}${link}`, packageResult.salt);
    storeInSession(`${SIGNATURE_KEY}${link}`, packageResult.r.signature);
    storeInSession(`${PRIVATE_KEY}${link}`, keyPairResult.r.privateKey);
    storeInSession(`${PUBLIC_KEY}${link}`, keyPairResult.r.publicKey);

    const socket = LinkSocketApi.instance;
    const args = {
      ...packageResult.r,
      ttl: exchangeStore.waitingTime * 60,
      link,
    };

    if (socket?.connected) {
      socket.on("to:sender", onRsa);

      await socket.emit("package:send", args);
    } else {
      setError("Error");
    }
  };

  interface IRsaProps {
    rsa: IRSAResponseBody;
    hexString: string;
    hexStringSHA: string;
    error: null;
  }

  const onRsa = async (props: IRsaProps) => {
    const { rsa, hexString, hexStringSHA, error } = props;

    if (error) {
      throw new Error(error);
    }

    setHStringSHA(hexStringSHA);

    const salt = getFromSession(`${SALT_KEY}${link}`);
    const privateKey = getFromSession(`${PRIVATE_KEY}${link}`);
    const publicKey = getFromSession(`${PUBLIC_KEY}${link}`);
    const crypto = new window.SteroidCrypto();
    const changePassword = {
      pass: exchangeStore.password,
      chatID: exchangeStore.chatId,
    };

    if (salt && privateKey && publicKey) {
      const result = await crypto.encryptData(
        rsa,
        hexString,
        hexStringSHA,
        privateKey,
        publicKey,
        changePassword,
        salt
      );

      if (result.e) {
        throw new Error(result.e);
      }

      setEncryptionResult(result);

      if (!exchangeStore.verificationPhrase) {
        onApproveExchange(result, hexStringSHA);
      }
    }
  };

  const onApproveExchange = (
    encryptResponse?: IEncryptDataResponse,
    hexStringSHA?: string
  ) => {
    const publicKey = getFromSession(`${PUBLIC_KEY}${link}`);
    const encryptionResultResponse = encryptionResult ?? encryptResponse;
    const hexSHA = hStringSHA ?? hexStringSHA;

    if (encryptionResultResponse && publicKey) {
      const signature = getFromSession(`${SIGNATURE_KEY}${link}`);
      const socket = LinkSocketApi.instance;

      socket?.emit("to:getter", {
        encryptionResult: encryptionResultResponse.r,
        signature,
        publicKey: publicKey,
        hexStringSHA: hexSHA,
        aes: encryptionResultResponse.aes,
        link,
      });
    }
  };

  const generateLink = () => {
    const socket = LinkSocketApi.instance;
    if (socket) {
      const code = nanoid();
      socket.emit("link:check", {
        code,
        ttl: exchangeStore.waitingTime * 60,
        validationPhraseEnabled: exchangeStore.verificationPhrase,
      });
      setLink(code);
    }
  };

  const createConnection = async () => {
    if (!exchangeStore.password) {
      setError("Please create password in Password Settings");
      return;
    }

    try {
      setLoading(true);
      const socket = LinkSocketApi.createConnection();

      socket.on("connect", async () => {
        generateLink();
      });
      // socket.on("link:result", onHandleResult);
      socket.on("link:retry", generateLink);
    } catch (e) {
      console.error("Create Connection Error: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = LinkSocketApi.instance;

    if (socket) {
      socket.on("link:result", onHandleResult);
      socket.on("last:check:to", onLastCheck);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LinkSocketApi.instance, link]);

  const openChat = async () => {
    const crypto = new window.SteroidCrypto();
    const skey = await crypto.getSkey(exchangeStore.password);

    const handleConnect = async ({ id }: { id: string }) => {
      const roomId = id;

      if (skey) {
        const newChat = {
          id: roomId,
          name: `chat with id: ${exchangeStore.chatId}`,
          data: [],
          unreadMessages: 0,
          nickname: `Anonymous-${roomId}`,
          skey,
          chatId: exchangeStore.chatId,
          password: exchangeStore.password,
          roomId,
          timestamp: Date.now(),
        };

        dispatch(setMessagesByChatId(newChat));
        navigate(`/chats/${roomId}`);
      } else {
        setError("Connection Error");
      }
    };

    const socket = SocketApi.createConnection({
      chatId: exchangeStore.chatId,
      skey,
    });
    socket.on("onConnect", handleConnect);
  };

  const onCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.protocol}//${window.location.hostname}/change/link/${link}`
    );
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <>
      <Header>
        <BackBtn />
        <span className="text-lg font-semibold">Exchange</span>
        <EditBtn className="invisible" />
      </Header>

      <div className="max-w-2xl mx-auto py-[35px] gap-[35px]">
        {error && (
          <div className="bg-darkGray md:rounded-[10px] p-4 mb-4">
            <p className="text-red">{error}</p>
          </div>
        )}

        <div className="bg-darkGray md:rounded-[10px] p-4 mb-4">
          <button
            className="w-[60px] flex items-center gap-2 text-[17px] text-blue"
            onClick={() => createConnection()}
          >
            <span>Connect</span>
          </button>
        </div>

        {loading && <Spinner size={8} />}

        {link && !loading && (
          <div>
            <p className="mb-[6px] pl-4 text-sm text-gray">
              You can share the link with your interlocutor
            </p>

            <div className="p-4 bg-darkGray md:rounded-[10px] mb-4">
              <div className="text-blue cursor-pointer" onClick={onCopyLink}>
                {`${window.location.protocol}//${window.location.hostname}/change/link/${link}`}
              </div>
            </div>
          </div>
        )}

        {showToast && (
          <div className="absolute top-8 right-8">
            <div
              className="max-w-xs bg-darkGray text-sm text-white rounded-md shadow-lg dark:bg-gray-900 mb-3 ml-3 ml-3"
              role="alert"
            >
              <div className="flex p-4">
                Link copied
                <div className="ml-4">
                  <button
                    type="button"
                    className="inline-flex flex-shrink-0 justify-center items-center h-4 w-4 rounded-md text-white/[.5] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-600 transition-all text-sm dark:focus:ring-offset-gray-900 dark:focus:ring-gray-800"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="w-3.5 h-3.5"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.92524 0.687069C1.126 0.486219 1.39823 0.373377 1.68209 0.373377C1.96597 0.373377 2.2382 0.486219 2.43894 0.687069L8.10514 6.35813L13.7714 0.687069C13.8701 0.584748 13.9882 0.503105 14.1188 0.446962C14.2494 0.39082 14.3899 0.361248 14.5321 0.360026C14.6742 0.358783 14.8151 0.38589 14.9468 0.439762C15.0782 0.493633 15.1977 0.573197 15.2983 0.673783C15.3987 0.774389 15.4784 0.894026 15.5321 1.02568C15.5859 1.15736 15.6131 1.29845 15.6118 1.44071C15.6105 1.58297 15.5809 1.72357 15.5248 1.85428C15.4688 1.98499 15.3872 2.10324 15.2851 2.20206L9.61883 7.87312L15.2851 13.5441C15.4801 13.7462 15.588 14.0168 15.5854 14.2977C15.5831 14.5787 15.4705 14.8474 15.272 15.046C15.0735 15.2449 14.805 15.3574 14.5244 15.3599C14.2437 15.3623 13.9733 15.2543 13.7714 15.0591L8.10514 9.38812L2.43894 15.0591C2.23704 15.2543 1.96663 15.3623 1.68594 15.3599C1.40526 15.3574 1.13677 15.2449 0.938279 15.046C0.739807 14.8474 0.627232 14.5787 0.624791 14.2977C0.62235 14.0168 0.730236 13.7462 0.92524 13.5441L6.59144 7.87312L0.92524 2.20206C0.724562 2.00115 0.611816 1.72867 0.611816 1.44457C0.611816 1.16047 0.724562 0.887983 0.92524 0.687069Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {link && exchangeStore.verificationPhrase && !lastCheckSuccess && (
          <div className="p-4 bg-darkGray md:rounded-[10px] mb-4">
            {encryptionResult ? (
              <div className="flex-col">
                <div className="p-4">{encryptionResult.phrase}</div>

                <div>
                  <Button onClick={() => onApproveExchange()}>Approve</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="mr-4">
                  <Spinner size={8} />
                </div>

                <span>You can share the link and waite for phrase</span>
              </div>
            )}
          </div>
        )}

        {lastCheckSuccess && (
          <Button className="mb-8" onClick={openChat}>
            Open Chat
          </Button>
        )}

        {keyPairs && !loading && (
          <div>
            <p className="mb-[6px] pl-4 text-sm text-gray">MY KEYS</p>
            <div className="bg-darkGray md:rounded-[10px]">
              <NavLink
                to="/change/exchange"
                className="h-[50px] px-4 flex justify-between items-center md:rounded-t-[10px] hover:bg-hover cursor-pointer"
                onClick={() => {
                  setIsShownPublicModal(true);
                }}
              >
                <p className="text-[17px] font-medium">Public Key</p>
                <p className="text-[12px]">{`${keyPairs?.publicKey.slice(
                  0,
                  10
                )} ...`}</p>
                <img src="/arrow-right.svg" alt="arrow left icon" />
              </NavLink>
              <Divider full />

              <NavLink
                to="/change/exchange"
                className="h-[50px] px-[14px] flex justify-between items-center hover:bg-hover md:rounded-b-[10px] cursor-pointer"
                onClick={() => {
                  setIsShownPrivateModal(true);
                }}
              >
                <p className="text-[17px] font-medium">Private Key</p>
                <p className="text-[12px]">{`${keyPairs?.privateKey.slice(
                  0,
                  10
                )} ...`}</p>
                <div className="flex gap-4">
                  <img src="/arrow-right.svg" alt="arrow left icon" />
                </div>
              </NavLink>
            </div>
          </div>
        )}
      </div>

      {isShownPublicModal && (
        <BaseModal
          setIsShownModal={setIsShownPublicModal}
          body={
            <>
              <p className="mb-6 text-2xl font-bold">Public Key</p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 break-all overflow-scroll max-h-80">
                {keyPairs?.publicKey}
              </p>
            </>
          }
          footer={
            <Button
              onClick={() => setIsShownPublicModal((s) => !s)}
              className="md:w-[180px] m-0 md:text-center text-white bg-blue hover:bg-blue hover:bg-opacity-80 rounded-[10px]"
            >
              Close
            </Button>
          }
        />
      )}

      {isShownPrivateModal && (
        <BaseModal
          setIsShownModal={setIsShownPrivateModal}
          body={
            <>
              <p className="mb-6 text-2xl font-bold">Private Key</p> 
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 break-all overflow-scroll max-h-80">
                {keyPairs?.privateKey}
              </p>
            </>
          }
          footer={
            <Button
              onClick={() => setIsShownPrivateModal((s) => !s)}
              className="md:w-[180px] m-0 md:text-center text-white bg-blue hover:bg-blue hover:bg-opacity-80 rounded-[10px]"
            >
              Close
            </Button>
          }
        />
      )}
    </>
  );
};

export default Exchange;
