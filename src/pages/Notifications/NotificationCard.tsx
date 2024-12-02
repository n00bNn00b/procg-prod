import { useSocketContext } from "@/Context/SocketContext/SocketContext";
import { Send, Inbox, NotebookPen, Trash } from "lucide-react";
import { NavLink } from "react-router-dom";

const NotificationCard = () => {
  const {
    totalReceivedMessages,
    totalSentMessages,
    totalDraftMessages,
    totalRecycleBinMsg,
  } = useSocketContext();
  return (
    <div className="fixed flex flex-col rounded-md shadow-sm border w-[160px] ">
      <NavLink
        to="/notifications/inbox"
        className={({ isActive }) =>
          isActive
            ? "bg-light-200 flex justify-between hover:bg-light-200 px-2 py-4 items-center"
            : "flex justify-between hover:bg-light-200 px-2 py-4 items-center"
        }
      >
        <div className="flex gap-1">
          <Inbox />
          <p className="font-semibold">Inbox</p>
        </div>
        {totalReceivedMessages > 0 && (
          <p className="text-white px-2 rounded-full bg-winter-500 font-semibold">
            {totalReceivedMessages}
          </p>
        )}
      </NavLink>
      <NavLink
        to="/notifications/sent"
        className={({ isActive }) =>
          isActive
            ? "bg-light-200 flex justify-between hover:bg-light-200 px-2 py-4 items-center"
            : "flex justify-between hover:bg-light-200 px-2 py-4 items-center"
        }
      >
        <div className="flex gap-1">
          <Send />
          <p className="font-semibold">Sent</p>
        </div>
        {totalSentMessages > 0 && (
          <p className="text-white px-2 rounded-full bg-winter-500 font-semibold">
            {totalSentMessages}
          </p>
        )}
      </NavLink>
      <NavLink
        to="/notifications/drafts"
        className={({ isActive }) =>
          isActive
            ? "bg-light-200 flex justify-between hover:bg-light-200 px-2 py-4 items-center"
            : "flex justify-between hover:bg-light-200 px-2 py-4 items-center"
        }
      >
        <div className="flex gap-1">
          <NotebookPen />
          <p className="font-semibold">Drafts</p>
        </div>
        {totalDraftMessages > 0 && (
          <p className="text-white px-2 rounded-full bg-winter-500 font-semibold">
            {totalDraftMessages}
          </p>
        )}
      </NavLink>
      <NavLink
        to="/notifications/recycle-bin"
        className={({ isActive }) =>
          isActive
            ? "bg-light-200 flex justify-between hover:bg-light-200 px-2 py-4 items-center"
            : "flex justify-between hover:bg-light-200 px-2 py-4 items-center"
        }
      >
        <div className="flex gap-1">
          <Trash />
          <p className="font-semibold">Recycle Bin</p>
        </div>
        {totalRecycleBinMsg > 0 && (
          <p className="text-white px-2 rounded-full bg-winter-500 font-semibold">
            {totalRecycleBinMsg}
          </p>
        )}
      </NavLink>
    </div>
  );
};

export default NotificationCard;
