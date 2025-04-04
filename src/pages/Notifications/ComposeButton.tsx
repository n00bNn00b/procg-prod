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
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import Spinner from "@/components/Spinner/Spinner";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { UserModel } from "@/types/interfaces/users.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// import { send } from "process";

const ComposeButton = () => {
  const api = useAxiosPrivate();
  const { users, token, user } = useGlobalContext();
  const { handlesendMessage, handleDraftMessage } = useSocketContext();
  const { toast } = useToast();
  const [recivers, setRecivers] = useState<UserModel[]>([]);
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isAllClicked, setIsAllClicked] = useState(true);
  const sender = {
    name: user,
    profile_picture: token?.profile_picture.thumbnail,
  };
  const id = uuidv4();
  const date = new Date();
  const apiUrl = import.meta.env.VITE_NODE_ENDPOINT_URL;

  const receiverNames = recivers.map((rcvr) => rcvr.name);

  const totalusers = [...receiverNames, user];
  const involvedusers = [...new Set(totalusers)];
  const actualUsers = users.filter((usr) => usr.user_name !== user);

  const filterdUser = actualUsers.filter((user) =>
    user.user_name.toLowerCase().includes(query.toLowerCase())
  );

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleReciever = (reciever: UserModel) => {
    if (receiverNames.includes(reciever.name)) {
      const newArray = recivers.filter((rcvr) => rcvr.name !== reciever.name);
      setRecivers(newArray);
      setQuery("");
    } else {
      setRecivers((prevArray) => [...prevArray, reciever]);
      setQuery("");
    }
  };

  const handleSelectAll = () => {
    if (!isAllClicked) {
      setIsAllClicked(true);
      const newReceivers = actualUsers.map((usr) => {
        return {
          name: usr.user_name,
          profile_picture: usr.profile_picture.thumbnail,
        };
      });
      setRecivers(newReceivers);
    } else {
      setIsAllClicked(false);
      setRecivers([]);
    }
    setQuery("");
  };

  const handleRemoveReciever = (reciever: string) => {
    const newRecipients = recivers.filter((rcvr) => rcvr.name !== reciever);
    setRecivers(newRecipients);
  };

  const handleSend = async () => {
    const data = {
      id,
      sender,
      recivers,
      subject,
      body,
      date,
      status: "Sent",
      parentid: id,
      involvedusers,
      readers: receiverNames,
      holders: involvedusers,
      recyclebin: [],
    };
    const sendNotificationPayload = {
      id,
      parentid: id,
      date,
      sender: sender,
      recivers: recivers,
      subject,
      body,
    };
    try {
      setIsSending(true);

      const response = await api.post(`/messages`, data);

      if (response.status === 201) {
        handlesendMessage(data);
        await api.post(
          "/push-notification/send-notification",
          sendNotificationPayload
        );
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
      date,
      status: "Draft",
      parentid: id,
      involvedusers,
      readers: receiverNames,
      holders: [sender.name],
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
              <DropdownMenuContent className="w-60 max-h-[255px] overflow-auto scrollbar-thin ml-16">
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
                    onClick={() =>
                      handleReciever({
                        name: user.user_name,
                        profile_picture: user.profile_picture.thumbnail,
                      })
                    }
                    key={user.user_id}
                    className="flex justify-between px-2 items-center hover:bg-light-200 cursor-pointer"
                  >
                    <div className="flex flex-row gap-1 items-center">
                      <Avatar className="h-4 w-4">
                        <AvatarImage
                          src={`${apiUrl}/${user.profile_picture.thumbnail}`}
                        />
                        <AvatarFallback>
                          {user.user_name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>

                      <p>{user.user_name}</p>
                    </div>
                    {receiverNames.includes(user.user_name) ? (
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
                    key={rec.name}
                    className="flex gap-1 border h-8 px-2 items-center rounded-sm"
                  >
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={`${apiUrl}/${rec.profile_picture}`} />
                      <AvatarFallback>{rec.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-green-600">{rec.name}</p>
                    <div
                      onClick={() => handleRemoveReciever(rec.name)}
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
