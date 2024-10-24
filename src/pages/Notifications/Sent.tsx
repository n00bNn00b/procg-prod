import ComposeButton from "./ComposeButton";
import NotificationCard from "./NotificationCard";
import SentTable from "./SentTable";

const Sent = () => {
  return (
    <div>
      <NotificationCard />
      <SentTable path="Sent" person="To" />
      <ComposeButton />
    </div>
  );
};

export default Sent;
