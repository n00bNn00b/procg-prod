import ComposeButton from "./ComposeButton";
import NotificationCard from "./NotificationCard";
import NotificationTable from "./NotificationTable";

const Inbox = () => {
  return (
    <>
      <NotificationCard />
      <NotificationTable path="Inbox" person="From" />
      <ComposeButton />
    </>
  );
};

export default Inbox;
