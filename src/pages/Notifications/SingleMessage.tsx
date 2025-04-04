import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import axios from "axios";
import { ArrowLeft, Ellipsis, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReplyDialog from "./ReplyDialog";
import { Message } from "@/types/interfaces/users.interface";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/Spinner/Spinner";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SingleMessage = () => {
  const { handleDeleteMessage } = useSocketContext();
  const { token, user } = useGlobalContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const url = import.meta.env.VITE_NODE_ENDPOINT_URL;
  const { id } = useParams();

  const [totalMessages, setTotalMessages] = useState<Message[]>([]);
  const [parrentMessage, setParrentMessage] = useState<Message>({
    id: "",
    sender: { name: "", profile_picture: "" },
    recivers: [],
    subject: "",
    body: "",
    date: new Date(),
    status: "",
    parentid: "",
    involvedusers: [],
    readers: [],
    holders: [],
    recyclebin: [],
  });
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  //Fetch TotalReplyMessages
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get<Message[]>(
          `${url}/messages/reply/${id}/${user}`
        );
        const result = response.data;
        setTotalMessages(result);
        setIsLoaded(true);
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: `${error.message}}`,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, [id, toast, url, user]);

  //Fetch SingleMessage
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get<Message>(`${url}/messages/${id}`);
        const result = response.data;
        setParrentMessage(result);
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: `${error.message}}`,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, [id, toast, url, user]);

  useEffect(() => {
    if (totalMessages.length === 0 && isLoaded) {
      setTimeout(() => {
        navigate("/notifications/inbox");
      }, 500);
    }
  }, [isLoaded, navigate, totalMessages.length]);

  const handleDelete = async (msgId: string) => {
    try {
      const response = await axios.put(
        `${url}/messages/set-user-into-recyclebin/${msgId}/${token.user_name}`
      );
      if (response.status === 200) {
        handleDeleteMessage(msgId as string);
        setTotalMessages((prev) => prev.filter((msg) => msg.id !== msgId));
        toast({
          title: "Message has been moved to recyclebin.",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: `${error.message}`,
        });
      }
    }
  };

  const convertDate = (isoDateString: Date) => {
    const date = new Date(isoDateString);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };

  const renderMessage = (msg: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split the message by URLs and wrap each URL with <a> tag
    const parts = msg.split(urlRegex);

    return parts.map((part, index) => {
      // If the part matches the URL pattern, return a link
      if (urlRegex.test(part)) {
        return (
          <a
            href={part}
            key={index}
            className="text-blue-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
          </a>
        );
      }

      // Otherwise, return the text and convert newlines to <br />
      return part.split("\n").map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {line}
          <br />
        </React.Fragment>
      ));
    });
  };
  return (
    <div className="flex justify-center items-center w-full mb-4">
      {isLoading ? (
        <div className="flex h-[50vh] items-center">
          <Spinner size="80" color="#000000" />
        </div>
      ) : (
        <Card className="flex flex-col gap-4 w-full p-4">
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="p-1 rounded-md hover:bg-winter-100/50 h-7">
                    <Link to="/notifications/inbox">
                      <ArrowLeft size={20} />
                    </Link>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Back</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="font-bold ml-4">{parrentMessage.subject}</p>
          </div>
          <div className="flex flex-col gap-4 w-full ">
            {totalMessages.map((msg) => (
              <div className="flex gap-4 items-start" key={msg.id}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`${url}/${msg.sender.profile_picture}`} />
                  <AvatarFallback>{msg.sender.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <p className="font-semibold">{msg.sender.name}</p>
                      <div className="text-sm gap-1 flex items-center">
                        <span className="text-dark-400">to</span>
                        <span>{msg.recivers[0].name}</span>
                        {msg.recivers.length > 1 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger className="focus:outline-none">
                              {" "}
                              <Ellipsis strokeWidth={1} size={16} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {msg.recivers
                                .slice(1, msg.recivers.length + 1)
                                .map((rcvr) => (
                                  <p>{rcvr.name}</p>
                                ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm text-dark-400">
                        {convertDate(msg.date)}
                      </p>
                      <div className="flex items-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <ReplyDialog
                                  setTotalMessages={setTotalMessages}
                                  parrentMessage={parrentMessage}
                                />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Reply</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <button
                                  onClick={() => handleDelete(msg.id)}
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
                    </div>
                  </div>
                  <p className="text-dark-400 mb-2">
                    {renderMessage(msg.body)}
                  </p>
                  <div className="bg-gray-200 h-[0.7px] w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SingleMessage;
