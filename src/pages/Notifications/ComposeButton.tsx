import { MailPlus, Send, Delete, Save } from "lucide-react";
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
import { ChangeEvent, useState } from "react";
import { Check } from "lucide-react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import Spinner from "@/components/Spinner/Spinner";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";
// import { send } from "process";

const ComposeButton = () => {
  const { users, token, user } = useGlobalContext();
  const { handlesendMessage, handleDraftMessage } = useSocketContext();
  const { toast } = useToast();
  const url = import.meta.env.VITE_API_URL;
  const [recivers, setRecivers] = useState<string[]>([]);
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isAllClicked, setIsAllClicked] = useState(true);
  const sender = token.user_name;
  const id = uuidv4();

  const totalusers = [...recivers, sender];
  const uniqueUsers = [...new Set(totalusers)];
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

  const handleSend = async () => {
    const data = {
      id,
      sender,
      recivers,
      subject,
      body,
      date: new Date(),
      status: "Sent",
      parentid: id,
      involvedusers: uniqueUsers,
      readers: recivers,
      holders: uniqueUsers,
      recyclebin: [],
    };
    try {
      setIsSending(true);
      const response = await axios.post(`${url}/messages`, data);
      if (response.status === 201) {
        handlesendMessage(data);
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
      setRecivers([]);
      setSubject("");
      setBody("");
    }
  };

  const handleDraft = async () => {
    const data = {
      id,
      sender,
      recivers,
      subject,
      body,
      date: new Date(),
      status: "Draft",
      parentid: id,
      involvedusers: uniqueUsers,
      readers: recivers,
      holders: [sender],
      recyclebin: [],
    };
    try {
      setIsDrafting(true);
      const response = await axios.post(`${url}/messages`, data);
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
      setRecivers([]);
      setSubject("");
      setBody("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex gap-2 items-center px-5 py-2 rounded-xl bg-dark-100 text-white hover:scale-95 duration-300 fixed bottom-4">
          <MailPlus size={18} />
          <p className="font-semibold ">Compose</p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className=" font-bold">New Message</DialogTitle>
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
                    {recivers.includes(user.user_name) ? (
                      <Check size={14} color="#038C5A" />
                    ) : null}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-[calc(100%-11rem)]">
              <div className="rounded-sm max-h-[4.5rem] scrollbar-thin overflow-auto flex flex-wrap gap-1 justify-end">
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
              className="rounded-sm outline-none border pl-2 h-40 w-full scrollbar-thin text-sm"
              value={body}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setBody(e.target.value)
              }
            />
          </div>
        </div>
        <DialogFooter className="flex">
          {/* {recivers.length > 0 || body !== "" || subject !== "" ? ( */}
          <button
            disabled={recivers.length === 0 && body === "" && subject === ""}
            onClick={handleDraft}
            className={`${
              recivers.length === 0 && body === "" && subject === ""
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
          {/* ) : null}
           {recivers.length === 0 || body === "" ? null : ( */}
          <button
            disabled={recivers.length === 0 || body === "" || subject === ""}
            onClick={handleSend}
            className={`${
              recivers.length === 0 || body === "" || subject === ""
                ? "cursor-not-allowed bg-dark-400"
                : "cursor-pointer bg-dark-100"
            } flex gap-1 items-center px-4 py-1 rounded-r-full rounded-l-md text-white hover:scale-95 duration-300`}
          >
            {isSending ? (
              <Spinner size="20" color="#ffffff" />
            ) : (
              <Send size={18} />
            )}
            <p className="font-semibold ">Send</p>
          </button>
          {/* )} */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeButton;
