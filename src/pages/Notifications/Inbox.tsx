import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import ComposeButton from "./ComposeButton";
import NotificationCard from "./NotificationCard";
import NotificationTable from "./NotificationTable";

const Inbox = () => {
  const { token, messages} = useGlobalContext();
  
  const user = token.user_name;
  const totalSentMessages = messages.filter(msg => msg.status === "Sent");
  const totalDraftMessages = messages.filter(msg => msg.status === "Draft");
  const recievedMessages = totalSentMessages.filter(msg => msg.recivers.includes(user));
  const sentMessages = totalSentMessages.filter(msg => msg.sender === user);
  const draftMessages = totalDraftMessages.filter(msg => msg.sender === user);

 return (
    
    <>
      <NotificationCard recievedMessages={recievedMessages} sentMessages={sentMessages} draftMessages={draftMessages}/>
      <NotificationTable path="Inbox" person="From" recievedMessages={recievedMessages}/>
      <ComposeButton/>
    </>
      
      
    
  )
}

export default Inbox
