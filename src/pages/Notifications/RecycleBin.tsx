import ComposeButton from "./ComposeButton";
import NotificationCard from "./NotificationCard";
import RecycleBinTable from "./RecycleBinTable";

const RecycleBin = () => {
  return (
    <div>
      <NotificationCard />
      <RecycleBinTable path="Recycle Bin" person="To" />
      <ComposeButton />
    </div>
  );
};
export default RecycleBin;
