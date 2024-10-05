import ComposeButton from "./ComposeButton"
import NotificationCard from "./NotificationCard"
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import SentTable from "./SentTable";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";

const Sent = () => {
  const {user} = useGlobalContext();
  const {messages} = useSocketContext();

 const totalSentMessages = messages.filter(msg => msg.status === "Sent");
  const totalDraftMessages = messages.filter(msg => msg.status === "Draft");
  const recievedMessages = totalSentMessages.filter(msg => msg.recivers.includes(user));
  const sentMessages = totalSentMessages.filter(msg => msg.sender === user);
  const draftMessages = totalDraftMessages.filter(msg => msg.sender === user);

  return (
    <div>
      <NotificationCard recievedMessages={recievedMessages} sentMessages={sentMessages} draftMessages={draftMessages}/>
      <SentTable path="Sent" person="To" sentMessages={sentMessages}/>
      <ComposeButton/>
    </div>
  )
}

export default Sent
