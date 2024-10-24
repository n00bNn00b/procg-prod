import ComposeButton from "./ComposeButton";
import NotificationCard from "./NotificationCard";
import DraftTable from "./DraftTable";

const Draft = () => {
  return (
    <div>
      <NotificationCard />
      <DraftTable path="Draft" person="To" />
      <ComposeButton />
    </div>
  );
};

export default Draft;
