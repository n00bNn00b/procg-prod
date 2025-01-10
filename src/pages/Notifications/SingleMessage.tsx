import { Card, CardTitle } from "@/components/ui/card";
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

const SingleMessage = () => {
  const { handleDeleteMessage } = useSocketContext();
  const { token, user } = useGlobalContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;
  const { id } = useParams();

  const [totalMessages, setTotalMessages] = useState<Message[]>([]);
  const [parrentMessage, setParrentMessage] = useState<Message>({
    id: "",
    sender: "",
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
  const [totalInvolvedUsers, setTotalInvolvedUsers] = useState<string[]>([]);
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
        setTotalInvolvedUsers(result.involvedusers);
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

  const colors = [
    "text-[#725EF2]",
    "text-[#8C1C03]",
    "text-[#05A61D]",
    "text-[#D99E30]",
    "text-[#1B8EF2]",
    "text-[#D93D04]",
    "text-[#027313]",
  ];

  const getUniqueColor = (user: string) => {
    const indexOfUser = totalInvolvedUsers.indexOf(user);
    const realIndex = indexOfUser % colors.length;
    return `${colors[realIndex]} font-semibold`;
  };

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
        <div className="flex flex-col gap-4 w-full">
          {totalMessages.map((message) => (
            <Card key={message.id} className="p-6 w-full">
              <div className="flex text-dark-400 mb-4  ">
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <button
                          onClick={() => handleDelete(message.id)}
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <ReplyDialog
                          subject={message.subject}
                          parentid={parrentMessage.id}
                          involvedUsers={totalInvolvedUsers}
                          setTotalInvolvedUsers={setTotalInvolvedUsers}
                          setTotalMessages={setTotalMessages}
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Replay</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardTitle>{`${message.subject}`}</CardTitle>
              <p className="my-4 text-dark-400">{convertDate(message.date)}</p>
              <div className="flex justify-between">
                <div className="flex flex-col text-dark-400">
                  <p>From</p>
                  <p className={getUniqueColor(message.sender)}>
                    {message.sender}
                  </p>
                  <img
                    src="https://plus.unsplash.com/premium_photo-1682095643806-79da986ccf8d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="img"
                    className="w-10 h-10 rounded-full object-cover object-center"
                  />
                </div>
                <div className="flex flex-col text-dark-400">
                  <p className="text-right">To</p>
                  <div className="flex gap-2 max-w-[400px] items-center">
                    {message.recivers.slice(0, 2).map((recvr) => (
                      <div key={recvr} className="flex">
                        <div className="flex flex-col text-dark-400 items-center">
                          <p className={getUniqueColor(message.sender)}>
                            {recvr.slice(0, 8)}
                            {recvr.length > 8 && ".."}
                          </p>
                          <img
                            src="https://plus.unsplash.com/premium_photo-1682095643806-79da986ccf8d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="img"
                            className="w-10 h-10 rounded-full object-cover object-center"
                          />
                        </div>
                      </div>
                    ))}
                    {/* Hover Effect */}
                    {message.recivers.length > 2 && (
                      <>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className=" pb-2 px-2 rounded">
                              <Ellipsis />
                            </TooltipTrigger>
                            <TooltipContent className=" h-60 overflow-y-scroll scrollbar-thin p-4">
                              {message.recivers.map((rcvr) => (
                                <div
                                  key={rcvr}
                                  className="flex my-2 text-dark-400"
                                >
                                  {/* {message.recivers[0] === rcvr ||
                                message.recivers[1] === rcvr ? null : ( */}
                                  <div className="flex items-center gap-1">
                                    <img
                                      src="https://plus.unsplash.com/premium_photo-1682095643806-79da986ccf8d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                      alt="img"
                                      className="w-10 h-10 rounded-full object-cover object-center"
                                    />
                                    <p
                                      className={getUniqueColor(message.sender)}
                                    >
                                      {rcvr}
                                    </p>
                                  </div>
                                  {/* )} */}
                                </div>
                              ))}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <p className="whitespace-pre-wrap mt-4">
                {renderMessage(message.body)}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleMessage;
