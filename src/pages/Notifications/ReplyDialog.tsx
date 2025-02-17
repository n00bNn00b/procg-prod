import Spinner from "@/components/Spinner/Spinner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useToast } from "@/components/ui/use-toast";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Message } from "@/types/interfaces/users.interface";
import axios from "axios";
import { MessageCircleReply, Reply, Save } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReplyDialogProps {
  parrentMessage: Message;
  setTotalMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ReplyDialog = ({
  parrentMessage,
  setTotalMessages,
}: ReplyDialogProps) => {
  const api = useAxiosPrivate();
  const { token, user } = useGlobalContext();
  const { handlesendMessage, handleDraftMessage } = useSocketContext();
  const [subject, setSubject] = useState<string>(
    `Re: ${parrentMessage?.subject}`
  );
  const [body, setBody] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);

  const id = uuidv4();
  const { toast } = useToast();
  const sender = {
    name: user,
    profile_picture: token?.profile_picture.thumbnail,
  };
  const url = import.meta.env.VITE_API_URL;
  const totalInvolved = [...parrentMessage.recivers, parrentMessage.sender];
  const recivers = totalInvolved.filter((rcvr) => rcvr.name !== user);
  const receiverNames = recivers.map((rcvr) => rcvr.name);

  const handleSend = async () => {
    const data = {
      id,
      sender,
      recivers,
      subject,
      body,
      date: new Date(),
      status: "Sent",
      parentid: parrentMessage.parentid,
      involvedusers: parrentMessage.involvedusers,
      readers: receiverNames,
      holders: parrentMessage.involvedusers,
      recyclebin: [],
    };

    const sendNotificationPayload = {
      sender,
      recivers: receiverNames,
      subject,
      body,
    };
    try {
      setIsSending(true);
      const response = await axios.post(`${url}/messages`, data);
      console.log(data);
      console.log(response.data);
      if (response.status === 201) {
        handlesendMessage(data);
        setTotalMessages((prev) => [data, ...prev]);
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
      parentid: parrentMessage.parentid,
      involvedusers: parrentMessage.involvedusers,
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
      setBody("");
    }
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
          <div className="flex gap-4 items-center">
            <label className="font-semibold text-dark-400">To</label>
            <div className="rounded-sm max-h-[4.5rem] scrollbar-thin overflow-auto flex flex-wrap gap-1 justify-end">
              {recivers.map((rec) => (
                <div
                  key={rec.name}
                  className="flex gap-1 border h-8 px-2 items-center rounded-sm"
                >
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={`${url}/${rec.profile_picture}`} />
                    <AvatarFallback>{rec.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold ">{rec.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full text-dark-400">
            <label className="font-semibold ">Subject</label>
            <div className="rounded-sm outline-none border pl-2 h-8 w-full text-sm flex items-center">
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
            disabled={recivers.length === 0 || body === ""}
            onClick={handleSend}
            className={`${
              body.length === 0 || body === "" || recivers.length === 0
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
