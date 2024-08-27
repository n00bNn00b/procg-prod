import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import ComposeButton from "./ComposeButton";
import NotificationCard from "./NotificationCard";
import NotificationTable from "./NotificationTable";
import { useEffect, useState } from "react";
import { Message } from "@/types/interfaces/users.interface";

const Inbox = () => {
  const { token, messages} = useGlobalContext();
  const [newMessages, setNewMessages] = useState<Message[]>([]);

  useEffect(() => {
    setNewMessages(messages)
  }, [messages]);

  const user = token.user_name;
  const totalSentMessages = newMessages.filter(msg => msg.status === "Sent");
  const totalDraftMessages = newMessages.filter(msg => msg.status === "Draft");
  const recievedMessages = totalSentMessages.filter(msg => msg.recivers.includes(user));
  const sentMessages = totalSentMessages.filter(msg => msg.sender === user);
  const draftMessages = totalDraftMessages.filter(msg => msg.sender === user);

  return (
    <div>
      <NotificationCard recievedMessages={recievedMessages} sentMessages={sentMessages} draftMessages={draftMessages}/>
      <NotificationTable path="Inbox" person="From" recievedMessages={recievedMessages}/>
      <ComposeButton/>
    </div>
  )
}

export default Inbox
