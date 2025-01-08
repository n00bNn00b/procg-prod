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

interface ReplyDialogProps {
  subject: string;
  parentid: string;
  involvedUsers: string[];
  setTotalMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ReplyDialog = ({
  subject,
  parentid,
  involvedUsers,
  setTotalMessages,
}: ReplyDialogProps) => {
  const api = useAxiosPrivate();
  const { token } = useGlobalContext();
  const { handlesendMessage, handleDraftMessage } = useSocketContext();
  const { toast } = useToast();
  const url = import.meta.env.VITE_API_URL;
  // const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const sender = token.user_name;
  const recivers = involvedUsers.filter((user) => user !== sender);
  const id = uuidv4();

  const handleSend = async () => {
    const data = {
      id,
      sender,
      recivers,
      subject,
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
      subject,
      body,
      date: new Date(),
      status: "ReplayDraft",
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

  return (
    <Dialog>
      <DialogTrigger className="p-1 rounded-md hover:bg-winter-100/50">
        <MessageCircleReply size={20} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className=" font-bold">
            {"Re:" + " " + subject}
          </DialogTitle>
        </DialogHeader>
        {/* <div className="flex flex-col gap-2 w-full text-dark-400">
          <label className="font-semibold ">Subject</label>
          <input
            type="text"
            className="rounded-sm outline-none border pl-2 h-8 w-full text-sm"
            disabled
            value={"Re:" + " " + subject}
            // onChange={(e: ChangeEvent<HTMLInputElement>) =>
            //   setSubject(e.target.value)
            // }
          />
        </div> */}
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
            disabled={body.length === 0 || body === ""}
            onClick={handleSend}
            className={`${
              body.length === 0 || body === ""
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
