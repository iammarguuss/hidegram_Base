import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Button from "@/components/ui/button";
import Divider from "@/components/ui/divider";
import { Spinner } from "@/components/ui/spinner";
import { LinkSocketApi } from "@/link.socket";
import { SocketApi } from "@/socket";
import { IRootState } from "@/stores/rtk";
import { setMessagesByChatId } from "@/stores/slices/chat";
import { customAlphabet } from "nanoid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

const nanoid = customAlphabet("1234567890abcdef", 16);

const Exchange = () => {
  const exchangeStore = useSelector((s: IRootState) => s.exchangeSlice);
  const [keyPairs, setKeyPairs] = useState<IKeyPairsResponse | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>();
  const [link, setLink] = useState<string>();
  const [lastCheckSuccess, setLastCheckSuccess] = useState(false);
  const [encryptionResult, setEncryptionResult] = useState<
    IEncryptDataResponse | undefined
  >();
  const [hStringSHA, setHStringSHA] = useState<string>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLastCheck = async (props: { signature: string; salt: string }) => {
    const { signature, salt } = props;
    const crypto = new window.SteroidCrypto();
    const checkResult = await crypto.lastCheck(signature, salt);
    setLastCheckSuccess(checkResult.s);
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

    window.sessionStorage.setItem(`salt_${hexStringSHA}`, packageResult.salt);
    window.sessionStorage.setItem(
      `salt_${hexStringSHA}_signature`,
      packageResult.r.signature
    );
    window.sessionStorage.setItem(
      `salt_${hexStringSHA}_privateKey`,
      keyPairResult.r.privateKey
    );
    window.sessionStorage.setItem(
      `salt_${hexStringSHA}_publicKey`,
      keyPairResult.r.publicKey
    );

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

    const salt = window.sessionStorage.getItem(`salt_${hexStringSHA}`);
    const privateKey = window.sessionStorage.getItem(
      `salt_${hexStringSHA}_privateKey`
    );
    const publicKey = window.sessionStorage.getItem(
      `salt_${hexStringSHA}_publicKey`
    );
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
    }
  };

  const onApprove = () => {
    if (encryptionResult && keyPairs) {
      const signature = window.sessionStorage.getItem(
        `salt_${hStringSHA}_signature`
      );

      const socket = LinkSocketApi.instance;

      socket?.emit("to:getter", {
        encryptionResult: encryptionResult.r,
        signature,
        publicKey: keyPairs.publicKey,
        hexStringSHA: hStringSHA,
        aes: encryptionResult.aes,
        link,
      });
    }
  };

  const generateLink = () => {
    const socket = LinkSocketApi.instance;
    if (socket) {
      const code = nanoid();
      socket.emit("link:check", { code, ttl: exchangeStore.waitingTime * 60 });
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
      socket.on("last:check", onLastCheck);
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
          <div className="p-4 bg-darkGray md:rounded-[10px] mb-4">
            <a
              className="text-blue"
              target="_blank"
              rel="noopener noreferrer"
              href={`${window.location.protocol}//${window.location.hostname}/change/link/${link}`}
            >{`${window.location.protocol}//${window.location.hostname}/change/link/${link}`}</a>
          </div>
        )}

        {link && exchangeStore.verificationPhrase && (
          <div className="p-4 bg-darkGray md:rounded-[10px] mb-4">
            {encryptionResult ? (
              <>
                <div>{encryptionResult.phrase}</div>
                <Button onClick={onApprove}>Approve</Button>
              </>
            ) : (
              <div>Please waite for phrase</div>
            )}
          </div>
        )}

        {lastCheckSuccess && <Button onClick={openChat}>Open Chat</Button>}

        {keyPairs && !loading && (
          <div>
            <p className="mb-[6px] pl-4 text-sm text-gray">MY KEYS</p>
            <div className="bg-darkGray md:rounded-[10px]">
              <NavLink
                to="/change/exchange"
                className="h-[50px] px-4 flex justify-between items-center md:rounded-t-[10px] hover:bg-hover cursor-pointer"
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
    </>
  );
};

export default Exchange;
