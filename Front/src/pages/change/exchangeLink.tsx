import BackBtn from "@/components/backBtn";
import EditBtn from "@/components/editBtn";
import Header from "@/components/header";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { LinkSocketApi } from "@/link.socket";
import { SocketApi } from "@/socket";
import { setMessagesByChatId } from "@/stores/slices/chat";
import { getFromSession, storeInSession } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export const ExchangeLink = () => {
  const { link } = useParams();
  const [error, setError] = useState<boolean>(false);
  const [validationPhrase, setValidationPhrase] = useState("");
  const [loading, setLoading] = useState<boolean>();
  const [packageBody, setPackageBody] = useState<
    ICreatePackageResponseBody | undefined
  >();
  const [hexString, setHexString] = useState<string | undefined>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  interface IFinalAccepterProps {
    encryptionResult: IEncryptDataResponseBody;
    signature: string;
    publicKey: string;
    hexStringSHA: string;
    aes: string;
  }

  const onFinalAccepter = async (props: IFinalAccepterProps) => {
    const { encryptionResult, signature, publicKey, hexStringSHA } = props;
    const crypto = new window.SteroidCrypto();
    const aes = getFromSession(`aes_${link}`);

    if (aes) {
      const result = await crypto.finalAccepter(
        encryptionResult,
        signature,
        publicKey,
        hexStringSHA,
        aes
      );

      if (result.e) {
        setError(true);
      }

      const pass = result.r.finalKey.pass;
      const skey = await crypto.getSkey(pass);
      const chatId = result.r.finalKey.chatID;

      const socket = SocketApi.createConnection({ chatId, skey });

      const handleConnect = async ({ id }: { id: string }) => {
        const roomId = id;

        if (skey && pass) {
          const newChat = {
            id: roomId,
            name: `chat with id: ${chatId}`,
            data: [],
            unreadMessages: 0,
            nickname: `Anonymous-${roomId}`,
            skey,
            chatId: chatId,
            password: pass,
            roomId,
            timestamp: Date.now(),
          };

          socket.emit("last:check:from", { link, signature });

          dispatch(setMessagesByChatId(newChat));
          navigate(`/chats/${roomId}`);
        } else {
          setError(true);
        }
      };

      socket.on("onConnect", handleConnect);
    } else {
      setError(true);
    }
  };

  const onResult = async (props: {
    packageBody: ICreatePackageResponseBody;
    hexString: string;
    error?: string;
  }) => {
    const { packageBody, hexString, error } = props;

    if (error) {
      setError(true);
    }

    setPackageBody(packageBody);
    setHexString(hexString);
    setLoading(false);
  };

  useEffect(() => {
    const createConnection = async () => {
      if (link) {
        try {
          setLoading(true);
          const socket = LinkSocketApi.createConnection();

          socket.on("connect", async () => {
            socket.emit("prevalidate", {
              link,
            });
          });
          socket.on("prevalidate:result", onResult);
          socket.on("final:accepter", onFinalAccepter);
          socket.on("exception", () => setError(true));
        } catch (e) {
          console.error("Create Connection Error: ", e);
          setError(true);
        }
      }
    };

    createConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link]);

  const onChangeValidationPhrase = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValidationPhrase(event.target.value);
  };

  const onSubmit = async () => {
    const crypto = new window.SteroidCrypto();

    if (packageBody && hexString) {
      const validationResult = await crypto.prevalidator(
        {
          publicKey: packageBody.publicKey,
          originSha: packageBody.originSha,
          signature: packageBody.signature,
        },
        hexString
      );

      const responseResult = await crypto.responceRSA(
        validationResult.r,
        hexString,
        validationPhrase
      );

      if (responseResult.e) {
        setError(true);
      }

      storeInSession(`aes_${link}`, responseResult.aes);

      const socket = LinkSocketApi.instance;

      socket?.emit("rsa", {
        rsa: responseResult.r,
        link,
      });
    } else {
      setError(true);
    }
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
            <p className="text-red">Create Connection Error</p>
          </div>
        )}

        {loading ? (
          <Spinner size={8} />
        ) : (
          <>
            <div className="max-w-2xl mx-auto py-[35px] gap-[35px]">
              <div className="mb-[6px] ml-[16px] text-gray text-sm">
                VERIFICATION PHRASE
              </div>

              <div className="bg-darkGray flex md:rounded-[10px]">
                <Input
                  className="text-gray md:rounded-[10px]"
                  value={validationPhrase}
                  onChange={onChangeValidationPhrase}
                />

                {validationPhrase && (
                  <img
                    src="/x-icon.svg"
                    alt="clear verification phrase"
                    className="mr-4"
                    onClick={() => setValidationPhrase("")}
                  />
                )}
              </div>
            </div>

            <Button onClick={onSubmit}>Send</Button>
          </>
        )}
      </div>
    </>
  );
};
