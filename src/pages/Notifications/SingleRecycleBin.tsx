import { ArrowLeft, Ellipsis, Trash2 } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Message } from "@/types/interfaces/users.interface";
import Spinner from "@/components/Spinner/Spinner";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";

const SingleRecycleBin = () => {
  const { token } = useGlobalContext();
  const { handleDeleteMessage } = useSocketContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const url = import.meta.env.VITE_NODE_ENDPOINT_URL;
  const idString = useParams();
  const id = idString.id;
  const [message, setMessage] = useState<Message>({
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get<Message>(`${url}/messages/${id}`);
        const result = response.data;
        setMessage(result);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, [id, url]);

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

  const convertDate = (isoDateString: Date) => {
    const date = new Date(isoDateString);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };
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
    const indexOfUser = message.involvedusers.indexOf(user);
    const realIndex = indexOfUser % colors.length;
    return `${colors[realIndex]} font-semibold`;
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
    <div className="w-full flex justify-center pb-4">
      {isLoading ? (
        <div className="flex h-[50vh] items-center">
          <Spinner size="80" color="#000000" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <Card key={message?.id} className="p-6 w-full">
            <div className="flex text-dark-400 mb-4 items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="p-1 rounded-md hover:bg-winter-100/50 h-7">
                      <Link to="/notifications/recycle-bin">
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
                        onClick={() => handleDelete()}
                        className="p-1 rounded-md hover:bg-winter-100/50"
                      >
                        <Trash2 size={20} />
                      </button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Permanently delete</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardTitle>{`${message.subject}`}</CardTitle>
            <p className="my-4 text-dark-400">{convertDate(message.date)}</p>
            <div className="flex justify-between">
              <div className="flex flex-col text-dark-400">
                <p>From</p>
                <p className={getUniqueColor(message.sender.name)}>
                  {message.sender.name}
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
                    <div key={recvr.name} className="flex">
                      <div className="flex flex-col text-dark-400 items-center">
                        <p className={getUniqueColor(message.sender.name)}>
                          {recvr.name.slice(0, 8)}
                          {recvr.name.length > 8 && ".."}
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
                                key={rcvr.name}
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
                                    className={getUniqueColor(
                                      message.sender.name
                                    )}
                                  >
                                    {rcvr.name}
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
        </div>
        // <Card className="w-full mb-4">
        //   <CardHeader>
        //     <div className="flex text-dark-400">
        //       <Link
        //         to="/notifications/drafts"
        //         className="p-1 rounded-md hover:bg-winter-100/50"
        //       >
        //         <ArrowLeft size={20} />
        //       </Link>
        //       <button
        //         onClick={handleDelete}
        //         className="p-1 rounded-md hover:bg-winter-100/50"
        //       >
        //         <Trash2 size={20} />
        //       </button>
        //     </div>
        //     <CardTitle className=" font-bold">Draft Message</CardTitle>
        //   </CardHeader>
        //   <CardContent>
        //     <div className="flex flex-col gap-4">
        //       <div className="flex gap-4 justify-between">
        //         <DropdownMenu>
        //           <DropdownMenuTrigger className="bg-dark-100 text-white w-44 h-8 rounded-sm font-semibold ">
        //             Select Recipients
        //           </DropdownMenuTrigger>
        //           <DropdownMenuContent className="w-44 max-h-[255px] overflow-auto scrollbar-thin">
        //             <input
        //               type="text"
        //               className="w-full bg-light-100 border-b border-light-400 outline-none pl-2"
        //               placeholder="Search..."
        //               value={query}
        //               onChange={handleQueryChange}
        //             />
        //             <div
        //               onClick={handleSelectAll}
        //               className="flex justify-between px-2 items-center hover:bg-light-200 cursor-pointer"
        //             >
        //               <p>All</p>
        //             </div>
        //             {filterdUser.map((user) => (
        //               <div
        //                 onClick={() => handleReciever(user.user_name)}
        //                 key={user.user_id}
        //                 className="flex justify-between px-2 items-center hover:bg-light-200 cursor-pointer"
        //               >
        //                 <p>{user.user_name}</p>
        //                 {recivers.includes(user.user_name) ? (
        //                   <Check size={14} color="#038C5A" />
        //                 ) : null}
        //               </div>
        //             ))}
        //           </DropdownMenuContent>
        //         </DropdownMenu>

        //         <div className="flex gap-2 w-[calc(100%-11rem)] justify-end">
        //           <div className="rounded-sm max-h-[4.5rem] scrollbar-thin overflow-auto flex flex-wrap gap-1">
        //             {recivers.map((rec) => (
        //               <div
        //                 key={rec}
        //                 className="flex gap-1 bg-winter-100 h-8 px-3 items-center rounded-full"
        //               >
        //                 <p className="font-semibold ">{rec}</p>
        //                 <div
        //                   onClick={() => handleRemoveReciever(rec)}
        //                   className="flex h-[65%] items-end cursor-pointer"
        //                 >
        //                   <Delete size={18} />
        //                 </div>
        //               </div>
        //             ))}
        //           </div>
        //         </div>
        //       </div>
        //       <div className="flex flex-col gap-2 w-full text-dark-400">
        //         <label className="font-semibold ">Subject</label>
        //         <input
        //           type="text"
        //           className="rounded-sm outline-none border pl-2 h-8 w-full text-sm"
        //           value={subject}
        //           onChange={(e: ChangeEvent<HTMLInputElement>) =>
        //             setSubject(e.target.value)
        //           }
        //         />
        //       </div>
        //       <div className="flex flex-col gap-2 w-full text-dark-400">
        //         <label className="font-semibold ">Body</label>
        //         <textarea
        //           className="rounded-sm outline-none border pl-2 h-36 w-full scrollbar-thin text-sm"
        //           value={body}
        //           onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
        //             setBody(e.target.value)
        //           }
        //         />
        //       </div>
        //     </div>
        //   </CardContent>
        //   <CardFooter className="flex justify-end">
        //     <div className="flex gap-2">
        //       <button
        //         //if receivers, subject, body change by any how then enabled button
        //         disabled={
        //           !userChanged &&
        //           oldMsgState?.subject === subject &&
        //           oldMsgState?.body === body
        //         }
        //         onClick={handleDraft}
        //         className={`${
        //           !userChanged &&
        //           oldMsgState?.subject === subject &&
        //           oldMsgState?.body === body
        //             ? " bg-dark-400 cursor-not-allowed"
        //             : " bg-dark-100 cursor-pointer"
        //         } flex gap-1 items-center px-5 py-2 rounded-l-full rounded-r-md text-white hover:scale-95 duration-300`}
        //       >
        //         {saveDraftLoading ? (
        //           <Spinner size="20" color="#ffffff" />
        //         ) : (
        //           <Save size={18} />
        //         )}
        //         <p className="font-semibold ">Save</p>
        //       </button>
        //       <button
        //         disabled={
        //           recivers.length === 0 || body === "" || subject === ""
        //         }
        //         onClick={handleSend}
        //         className={`${
        //           recivers.length === 0 || body === "" || subject === ""
        //             ? " bg-dark-400 cursor-not-allowed"
        //             : " bg-dark-100 cursor-pointer"
        //         } flex gap-1 items-center px-5 py-2 rounded-r-full rounded-l-md text-white hover:scale-95 duration-300`}
        //       >
        //         {isSending ? (
        //           <Spinner size="20" color="#ffffff" />
        //         ) : (
        //           <Send size={18} />
        //         )}
        //         <p className="font-semibold ">Send</p>
        //       </button>
        //     </div>
        //   </CardFooter>
        // </Card>
      )}
    </div>
  );
};

export default SingleRecycleBin;
