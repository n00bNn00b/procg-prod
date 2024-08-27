import ComposeButton from "./ComposeButton"
import NotificationCard from "./NotificationCard"
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import DraftTable from "./DraftTable";

const Draft = () => {
  const { token, messages} = useGlobalContext();
  
  const user = token.user_name;
  const totalSentMessages = messages.filter(msg => msg.status === "Sent");
  const totalDraftMessages = messages.filter(msg => msg.status === "Draft");
  const recievedMessages = totalSentMessages.filter(msg => msg.recivers.includes(user));
  const sentMessages = totalSentMessages.filter(msg => msg.sender === user);
  const draftMessages = totalDraftMessages.filter(msg => msg.sender === user);
  
  return (
    <div>
      <NotificationCard recievedMessages={recievedMessages} sentMessages={sentMessages} draftMessages={draftMessages}/>
      <DraftTable path="Draft" person="To" sentMessages={draftMessages}/>
      <ComposeButton/>
    </div>
  )
}

export default Draft
