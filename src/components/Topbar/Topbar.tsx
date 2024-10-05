import { Home, Bell, ListTodo, Mail, Menu, X } from "lucide-react";
import logo from "@/Image/logo-2.png";
import { Link, NavLink } from "react-router-dom";
import Dropdown from "./Dropdown";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";

const Topbar = () => {
  const { open, setOpen } = useGlobalContext();
  const {socketMessage} = useSocketContext();

  const uniquMessages = socketMessage.filter(
    (item, index) =>
      index === socketMessage.findIndex((obj) => obj.date === item.date)
  );
  return (
    <div className="flex justify-between items-center h-[3rem] w-[100vw] px-8 bg-white shadow-md fixed z-40 ">
      <div className="flex gap-2 items-center">
        {open ? (
          <button className="bg-winter-100 w-8 h-8 rounded-full hover:rotate-[360deg] duration-500 flex justify-center items-center">
            <X onClick={() => setOpen(false)} className="text-2xl" />
          </button>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="bg-winter-100 w-8 h-8 rounded-full hover:rotate-[360deg] duration-500 flex justify-center items-center"
          >
            <Menu className="text-2xl" />
          </button>
        )}
        <Link to="/home">
          <img src={logo} alt="logo" className="h-[2rem] w-auto" />
        </Link>
        <p className="text-blue-600 font-semibold mt-3">Advanced Controls</p>
      </div>

      <div className="flex gap-6 items-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-winter-100 px-4 py-2 rounded-md flex gap-2 items-center hover:bg-winter-100/50"
              : "px-4 py-2 rounded-md flex gap-2 items-center hover:bg-winter-100/50"
          }
        >
          <Home className="text-2xl" />
          <p className="font-semibold">Home</p>
        </NavLink>
        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            isActive
              ? "bg-winter-100 px-4 py-2 rounded-md flex gap-2 items-center hover:bg-winter-100/50"
              : "px-4 py-2 rounded-md flex gap-2 items-center hover:bg-winter-100/50"
          }
        >
          <Bell className="text-2xl" />
          <p className="font-semibold">Alerts</p>
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            isActive
              ? "bg-winter-100 px-4 py-2 rounded-md flex gap-2 items-center hover:bg-winter-100/50"
              : "px-4 py-2 rounded-md flex gap-2 items-center hover:bg-winter-100/50"
          }
        >
          <ListTodo className="text-2xl" />
          <p className="font-semibold">Tasks</p>
        </NavLink>
        <NavLink
          to="/notifications/inbox"
          className={({ isActive }) =>
            isActive
              ? "bg-winter-100 px-4 py-2 rounded-md flex gap-2 items-center hover:bg-winter-100/50 relative"
              : "px-4 py-2 rounded-md flex gap-2 items-center hover:bg-winter-100/50 relative"
          }
        >
          <Mail className="text-2xl" />
          {uniquMessages.length > 0 ? (
            <p className="w-4 h-4 flex justify-center items-center rounded-full bg-Red-100 text-white text-sm absolute left-8 top-1">
              {uniquMessages.length}
            </p>
          ) : null}
          <p className="font-semibold">Notifications</p>
        </NavLink>
        <Dropdown />
      </div>
    </div>
  );
};

export default Topbar;
