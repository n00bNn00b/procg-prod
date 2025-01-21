import { Home, Bell, Mail, Menu, X, ListTodo } from "lucide-react";
import logo from "@/Image/logo-2.png";
import { Link, NavLink, useLocation } from "react-router-dom";
import Dropdown from "./Dropdown";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";

const Topbar = () => {
  const { open, setOpen } = useGlobalContext();
  const { socketMessage } = useSocketContext();
  const uniquMessages = socketMessage.filter(
    (item, index) =>
      index === socketMessage.findIndex((obj) => obj.date === item.date)
  );
  const location = useLocation();

  return (
    <div className="flex justify-between items-center h-[3rem] w-[100vw] px-5 bg-white shadow-md fixed z-40 ">
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
        <Link to="/">
          <img src={logo} alt="logo" className="h-[2rem] w-auto" />
        </Link>
        <p className="text-blue-600 font-semibold mt-3">Advanced Controls</p>
      </div>

      <div className="flex gap-1 items-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-winter-100 px-2 py-2 rounded-md flex gap-2 items-center hover:bg-hover"
              : "px-2 py-2 rounded-md flex gap-2 items-center hover:bg-hover"
          }
        >
          <Home className="text-2xl" />
          <p className="font-semibold hidden lg:block transition duration-300 ease-in-out">
            Home
          </p>
        </NavLink>
        <NavLink
          to="/action-items"
          className={({ isActive }) =>
            isActive
              ? "bg-winter-100 px-4 py-2 rounded-md flex gap-2 items-center hover:bg-hover"
              : "px-4 py-2 rounded-md flex gap-2 items-center hover:bg-hover"
          }
        >
          <ListTodo className="text-2xl" />
          <p className="font-semibold hidden lg:block transition duration-300 ease-in-out">
            Action Items
          </p>
        </NavLink>
        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            isActive
              ? "bg-winter-100 px-4 py-2 rounded-md flex gap-2 items-center hover:bg-hover"
              : "px-4 py-2 rounded-md flex gap-2 items-center hover:bg-hover"
          }
        >
          <Bell className="text-2xl" />
          <p className="font-semibold hidden lg:block transition duration-300 ease-in-out">
            Alerts
          </p>
        </NavLink>
        <NavLink
          to="/notifications/inbox"
          className={({ isActive }) =>
            isActive ||
            location.pathname === "/notifications/sent" ||
            location.pathname === "/notifications/drafts" ||
            location.pathname === "/notifications/recycle-bin"
              ? "bg-winter-100 px-4 py-2 rounded-md flex gap-2 items-center hover:bg-hover relative"
              : "px-4 py-2 rounded-md flex gap-2 items-center hover:bg-hover relative"
          }
        >
          <Mail className="text-2xl" />
          {uniquMessages.length > 0 ? (
            <p className="w-4 h-4 flex justify-center items-center rounded-full bg-Red-100 text-white text-sm absolute left-8 top-1">
              {uniquMessages.length}
            </p>
          ) : null}
          <p className="font-semibold hidden lg:block transition duration-300 ease-in-out">
            Notifications
          </p>
        </NavLink>
        <Dropdown />
      </div>
    </div>
  );
};

export default Topbar;
