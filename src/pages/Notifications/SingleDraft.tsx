import { Send, Delete, ArrowLeft, Trash, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ChangeEvent, useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Message } from "@/types/interfaces/users.interface";
import Spinner from "@/components/Spinner/Spinner";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";
import { v4 as uuidv4 } from "uuid";

interface IOldMsgTypes {
  receivers?: string[];
  subject?: string;
  body?: string;
}
const SingleDraft = () => {
  const { users, token, user } = useGlobalContext();
  const {
    handlesendMessage,
    // totalDraftMessages,
    handleDraftMessage,
    handleDeleteMessage,
    handleDraftMsgId,
  } = useSocketContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const url = import.meta.env.VITE_API_URL;
  const idString = useParams();
  const id = idString.id;
  const [recivers, setRecivers] = useState<string[]>([]);
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isAllClicked, setIsAllClicked] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saveDraftLoading, setSaveDraftLoading] = useState(false);
  const [oldMsgState, setOldMsgState] = useState<IOldMsgTypes | undefined>({});
  const [userChanged, setuserChanged] = useState<boolean>(false);
  const sender = token.user_name;
  const totalusers = [...recivers, sender];
  const uniqueUsers = [...new Set(totalusers)];
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get<Message>(`${url}/messages/${id}`);
        const result = response.data;
        setRecivers(result.recivers);
        setSubject(result.subject);
        setBody(result.body);
        setOldMsgState({
          receivers: result?.recivers,
          subject: result?.subject,
          body: result?.body,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, [id, url]);

  const actualUsers = users.filter((usr) => usr.user_name !== user);

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filterdUser = actualUsers.filter((user) =>
    user.user_name.toLowerCase().includes(query.toLowerCase())
  );

  const handleReciever = (reciever: string) => {
    if (isAllClicked) {
      const newArray = recivers.filter((rcvr) => rcvr !== reciever);
      setRecivers(newArray);
    }
    if (recivers.includes(reciever)) {
      return;
    } else {
      setRecivers((prevArray) => [...prevArray, reciever]);
    }
  };

  const handleRemoveReciever = (reciever: string) => {
    const newRecipients = recivers.filter((rcvr) => rcvr !== reciever);
    setRecivers(newRecipients);
  };

  const handleSelectAll = () => {
    setIsAllClicked(true);
    const allusers = users.map((user) => user.user_name);
    setRecivers(allusers);
  };

  const handleDraft = async () => {
    const data = {
      id: id as string,
      sender,
      recivers,
      subject,
      body,
      date: new Date(),
      status: "Draft",
      parentid: id as string,
      involvedusers: uniqueUsers,
      readers: recivers,
      holders: [sender],
      recyclebin: [],
    };
    setOldMsgState({
      receivers: recivers,
      subject,
      body,
    });
    // handlesendMessage(data);
    try {
      setSaveDraftLoading(true);
      const response = await axios.put(`${url}/messages/${id}`, data);
      if (response.status === 200) {
        handleDraftMessage(data);
        toast({
          title: "Message saved to drafts",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        toast({
          title: error.message,
        });
      }
    } finally {
      setSaveDraftLoading(false);
    }
    // navigate("/notifications/draft");
  };
  const handleSend = async () => {
    const newID = uuidv4();
    const data = {
      id: newID,
      sender,
      recivers,
      subject,
      body,
      date: new Date(),
      status: "Sent",
      parentid: newID,
      involvedusers: uniqueUsers,
      readers: recivers,
      holders: uniqueUsers,
      recyclebin: [],
    };
    try {
      setIsSending(true);
      const newMsg = await axios.post(`${url}/messages`, data);
      const deletedMsg = await axios.delete(`${url}/messages/${id}`);
      if (newMsg.data && deletedMsg.data) {
        handleDraftMsgId(id as string);
        handlesendMessage(data);
        console.log(data, "data");
        toast({
          title: "Message Sent",
        });
        setTimeout(async () => {
          navigate("/notifications/drafts");
        }, 500);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setRecivers([]);
      setSubject("");
      setBody("");
      setIsSending(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.put(
        `${url}/messages/set-user-into-recyclebin/${id}/${token.user_name}`
      );
      if (response.status === 200) {
        handleDeleteMessage(id as string);
        navigate("/notifications/drafts");
        toast({
          title: "Message has been moved to recyclebin.",
        });
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  useEffect(() => {
    const handleUserChange = async () => {
      if (oldMsgState?.receivers?.length ?? 0 > 0) {
        if (oldMsgState?.receivers?.length !== recivers.length) {
          setuserChanged(true);
        } else {
          oldMsgState?.receivers?.map((receiver) => {
            const res = recivers.every((recvr) => {
              if (receiver !== recvr) {
                return true;
              } else {
                return false;
              }
            });
            setuserChanged(res);
          });
        }
      } else if (recivers.length > 0) {
        if (recivers.length !== oldMsgState?.receivers?.length) {
          setuserChanged(true);
        } else {
          recivers.map((receiver) => {
            const res = oldMsgState?.receivers?.every((recvr) => {
              if (receiver !== recvr) {
                return true;
              } else {
                return false;
              }
            });
            setuserChanged(res ?? false);
          });
        }
      } else {
        setuserChanged(false);
      }
    };
    handleUserChange();
  }, [recivers, oldMsgState?.receivers]);
  return (
    <div className="w-full flex justify-center">
      {isLoading ? (
        <div className="flex h-[50vh] items-center">
          <Spinner size="80" color="#000000" />
        </div>
      ) : (
        <Card className="w-full mb-4">
          <CardHeader>
            <div className="flex text-dark-400">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="p-1 rounded-md hover:bg-winter-100/50 h-7">
                      <Link to="/notifications/drafts">
                        <ArrowLeft size={20} />
                      </Link>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Back</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <button
                        onClick={handleDelete}
                        className="p-1 rounded-md hover:bg-winter-100/50"
                      >
                        <Trash size={20} />
                      </button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Move to Recycle Bin</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardTitle className=" font-bold">Draft Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 justify-between">
                <DropdownMenu>
                  <DropdownMenuTrigger className="bg-dark-100 text-white w-44 h-8 rounded-sm font-semibold ">
                    Select Recipients
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-44 max-h-[255px] overflow-auto scrollbar-thin">
                    <input
                      type="text"
                      className="w-full bg-light-100 border-b border-light-400 outline-none pl-2"
                      placeholder="Search..."
                      value={query}
                      onChange={handleQueryChange}
                    />
                    <div
                      onClick={handleSelectAll}
                      className="flex justify-between px-2 items-center hover:bg-light-200 cursor-pointer"
                    >
                      <p>All</p>
                    </div>
                    {filterdUser.map((user) => (
                      <div
                        onClick={() => handleReciever(user.user_name)}
                        key={user.user_id}
                        className="flex justify-between px-2 items-center hover:bg-light-200 cursor-pointer"
                      >
                        <p>{user.user_name}</p>
                        {recivers.includes(user.user_name) ? (
                          <Check size={14} color="#038C5A" />
                        ) : null}
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex gap-2 w-[calc(100%-11rem)] justify-end">
                  <div className="rounded-sm max-h-[4.5rem] scrollbar-thin overflow-auto flex flex-wrap gap-1">
                    {recivers.map((rec) => (
                      <div
                        key={rec}
                        className="flex gap-1 bg-winter-100 h-8 px-3 items-center rounded-full"
                      >
                        <p className="font-semibold ">{rec}</p>
                        <div
                          onClick={() => handleRemoveReciever(rec)}
                          className="flex h-[65%] items-end cursor-pointer"
                        >
                          <Delete size={18} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full text-dark-400">
                <label className="font-semibold ">Subject</label>
                <input
                  type="text"
                  className="rounded-sm outline-none border pl-2 h-8 w-full text-sm"
                  value={subject}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSubject(e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2 w-full text-dark-400">
                <label className="font-semibold ">Body</label>
                <textarea
                  className="rounded-sm outline-none border pl-2 h-36 w-full scrollbar-thin text-sm"
                  value={body}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setBody(e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <div className="flex gap-2">
              <button
                //if receivers, subject, body change by any how then enabled button
                disabled={
                  !userChanged &&
                  oldMsgState?.subject === subject &&
                  oldMsgState?.body === body
                }
                onClick={handleDraft}
                className={`${
                  !userChanged &&
                  oldMsgState?.subject === subject &&
                  oldMsgState?.body === body
                    ? " bg-dark-400 cursor-not-allowed"
                    : " bg-dark-100 cursor-pointer"
                } flex gap-1 items-center px-5 py-2 rounded-l-full rounded-r-md text-white hover:scale-95 duration-300`}
              >
                {saveDraftLoading ? (
                  <Spinner size="20" color="#ffffff" />
                ) : (
                  <Save size={18} />
                )}
                <p className="font-semibold ">Save</p>
              </button>
              <button
                disabled={
                  recivers.length === 0 || body === "" || subject === ""
                }
                onClick={handleSend}
                className={`${
                  recivers.length === 0 || body === "" || subject === ""
                    ? " bg-dark-400 cursor-not-allowed"
                    : " bg-dark-100 cursor-pointer"
                } flex gap-1 items-center px-5 py-2 rounded-r-full rounded-l-md text-white hover:scale-95 duration-300`}
              >
                {isSending ? (
                  <Spinner size="20" color="#ffffff" />
                ) : (
                  <Send size={18} />
                )}
                <p className="font-semibold ">Send</p>
              </button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SingleDraft;
