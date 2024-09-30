import { Message } from "@/types/interfaces/users.interface";
import { Send, Inbox, Paperclip } from "lucide-react"
import { NavLink } from "react-router-dom";

interface NotificationCardProps {
  recievedMessages: Message[];
  sentMessages: Message[];
  draftMessages: Message[];
}

const NotificationCard = ({recievedMessages, sentMessages, draftMessages}: NotificationCardProps) => {
  return (
    <div className="fixed flex flex-col rounded-md shadow-sm border w-[160px] ">
          <NavLink to='/notifications/inbox' className={({isActive}) => isActive? "bg-light-200 flex justify-between hover:bg-light-200 px-4 py-4 items-center" : "flex justify-between hover:bg-light-200 px-4 py-4 items-center"}>
            <div className="flex gap-1">
              <Inbox/>
              <p className="font-semibold">Inbox</p>
            </div>
            <p className="text-white px-2 rounded-full bg-winter-500 font-semibold">{recievedMessages.length}</p>
          </NavLink>
          <NavLink to='/notifications/sent' className={({isActive}) => isActive? "bg-light-200 flex justify-between hover:bg-light-200 px-4 py-4 items-center" : "flex justify-between hover:bg-light-200 px-4 py-4 items-center"}>
            <div className="flex gap-1">
              <Send/>
              <p className="font-semibold">Sent</p>
            </div>
            <p className="text-white px-2 rounded-full bg-winter-500 font-semibold">{sentMessages.length}</p>
          </NavLink>
          <NavLink to='/notifications/draft' className={({isActive}) => isActive? "bg-light-200 flex justify-between hover:bg-light-200 px-4 py-4 items-center" : "flex justify-between hover:bg-light-200 px-4 py-4 items-center"}>
            <div className="flex gap-1">
            <Paperclip/>
              <p className="font-semibold">Draft</p>
              </div>
            <p className="text-white px-2 rounded-full bg-winter-500 font-semibold">{draftMessages.length}</p>
          </NavLink>
        </div>
  )
}

export default NotificationCard
