import ComposeButton from "./ComposeButton";
import NotificationCard from "./NotificationCard";
import DraftTable from "./DraftTable";

const Drafts = () => {
  return (
    <div>
      <NotificationCard />
      <DraftTable path="Drafts" person="To" />
      <ComposeButton />
    </div>
  );
};

export default Drafts;
