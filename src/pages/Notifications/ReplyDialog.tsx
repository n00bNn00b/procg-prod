import Spinner from "@/components/Spinner/Spinner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Message } from "@/types/interfaces/users.interface";
import axios from "axios";
import { Check, Delete, MessageCircleReply, Reply, Save } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ReplyDialogProps {
  subject: string;
  parentid: string;
  involvedUsers: string[];
  setTotalInvolvedUsers: React.Dispatch<React.SetStateAction<string[]>>;
  setTotalMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ReplyDialog = ({
  subject: sub,
  parentid,
  involvedUsers,
  setTotalInvolvedUsers,
  setTotalMessages,
}: ReplyDialogProps) => {
  const api = useAxiosPrivate();
  const { token, users, user } = useGlobalContext();
  const { handlesendMessage, handleDraftMessage } = useSocketContext();
  const [subject, setSubject] = useState<string>(sub);
  const [body, setBody] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [isAllClicked, setIsAllClicked] = useState<boolean>(true);

  const id = uuidv4();
  const { toast } = useToast();
  const sender = token.user_name;
  const url = import.meta.env.VITE_API_URL;
  const Users = users.filter((usr) => usr.user_name !== user);
  const recivers = involvedUsers.filter((rcvr) => rcvr !== sender);

  const handleSend = async () => {
    const data = {
      id,
      sender,
      recivers,
      subject: `Re: ${subject}`,
      body,
      date: new Date(),
      status: "Sent",
      parentid,
      involvedusers: involvedUsers,
      readers: recivers,
      holders: involvedUsers,
      recyclebin: [],
    };
    try {
      setIsSending(true);
      const response = await axios.post(`${url}/messages`, data);
      console.log(data);
      console.log(response.data);
      if (response.status === 201) {
        handlesendMessage(data);
        setTotalMessages((prev) => [data, ...prev]);
        toast({
          title: "Message Sent",
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
      setIsSending(false);
      // setSubject("");
      setBody("");
    }
  };

  const handleDraft = async () => {
    const data = {
      id,
      sender,
      recivers,
      subject: `Re: ${subject}`,
      body,
      date: new Date(),
      status: "Draft",
      parentid,
      involvedusers: involvedUsers,
      readers: recivers,
      holders: [sender],
      recyclebin: [],
    };
    try {
      setIsDrafting(true);
      const response = await api.post(`/messages`, data);
      if (response.status === 201) {
        handleDraftMessage(data);
        toast({
          title: "Message saved to drafts",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsDrafting(false);
      setBody("");
    }
  };
  const filterdUser = Users.filter((user) =>
    user.user_name.toLowerCase().includes(query.toLowerCase())
  );
  const handleReciever = (reciever: string) => {
    if (isAllClicked) {
      const newArray = involvedUsers.filter((rcvr) => rcvr !== reciever);
      setTotalInvolvedUsers(newArray);
    }
    if (involvedUsers.includes(reciever)) {
      return;
    } else {
      setTotalInvolvedUsers((prevArray) => [...prevArray, reciever]);
    }
  };
  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleRemoveReciever = (rec: string) => {
    console.log(rec, "click");
    const newRecipients = involvedUsers.filter((rcvr) => rcvr !== rec);
    setTotalInvolvedUsers(newRecipients);
  };
  const handleSelectAll = () => {
    setIsAllClicked(true);
    const allusers = users.map((user) => user.user_name);
    setTotalInvolvedUsers(allusers);
  };

  return (
    <Dialog>
      <DialogTrigger className="p-1 rounded-md hover:bg-winter-100/50">
        <MessageCircleReply size={20} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className=" font-bold">
            Reply
            {/* <p className="text-sm text-dark-400">To: {recivers.join(", ")}</p> */}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
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
                    {involvedUsers.includes(user.user_name) ? (
                      <Check size={14} color="#038C5A" />
                    ) : null}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-[calc(100%-11rem)]">
              <div className="rounded-sm max-h-[4.5rem] scrollbar-thin overflow-auto flex flex-wrap gap-1 justify-end">
                {involvedUsers
                  .filter((usr) => usr !== user)
                  ?.map((rec) => (
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
            <div className="rounded-sm outline-none border pl-2 h-8 w-full text-sm flex items-center">
              <p>Re: </p>
              <input
                type="text"
                value={subject}
                className="outline-none pl-1 w-full text-sm"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSubject(e.target.value)
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full text-dark-400">
            <label className="font-semibold ">Body</label>
            <textarea
              className="rounded-sm outline-none border pl-2 h-40 w-full scrollbar-thin text-sm"
              value={body}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setBody(e.target.value)
              }
            />
          </div>
        </div>

        <DialogFooter>
          <button
            disabled={body.length === 0 || body === ""}
            onClick={handleDraft}
            className={`${
              body.length === 0 || body === ""
                ? "cursor-not-allowed bg-dark-400"
                : "cursor-pointer bg-dark-100"
            } flex gap-1 items-center px-4 py-1 rounded-l-full rounded-r-md  text-white hover:scale-95 duration-300`}
          >
            {isDrafting ? (
              <Spinner size="20" color="#ffffff" />
            ) : (
              <Save size={18} />
            )}
            <p className="font-semibold ">Save as drafts</p>
          </button>
          <button
            disabled={involvedUsers.length === 0}
            onClick={handleSend}
            className={`${
              body.length === 0 || body === "" || involvedUsers.length === 0
                ? "cursor-not-allowed bg-dark-400"
                : "cursor-pointer bg-dark-100"
            } flex gap-1 items-center px-4 py-1 rounded-r-full rounded-l-md text-white hover:scale-95 duration-300`}
          >
            {isSending ? (
              <Spinner size="20" color="#ffffff" />
            ) : (
              <Reply size={18} />
            )}
            <p className="font-semibold ">Reply</p>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;
