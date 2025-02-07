import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Settings, ShieldBan, User } from "lucide-react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import { useSocketContext } from "@/Context/SocketContext/SocketContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
// const Loading = "/public/profile/loading.gif";

// import { useEffect } from "react";

const Dropdown = () => {
  const api = useAxiosPrivate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token, setToken } = useGlobalContext();
  const { handleDisconnect } = useSocketContext();
  const navigate = useNavigate();

  const userExample = {
    isLoggedIn: false,
    user_id: 0,
    user_name: "",
    user_type: "",
    tenant_id: 0,
    access_token: "",
    issuedAt: "",
    iat: 0,
    exp: 0,
    profile_picture: { original: "", thumbnail: "" },
  };
  const handleSignOut = async () => {
    await api.get(`/logout`);
    handleDisconnect();
    setToken(userExample);
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="border">
          <AvatarImage
            className="object-cover object-center"
            src={`${apiUrl}/${token.profile_picture.original}`}
          />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 mr-1">
        <DropdownMenuLabel className=" font-bold font-workSans text-lg text-center">
          {token.user_name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2 rounded hover:bg-hover text-sm">
          <NavLink
            to="/access-profiles"
            className={({ isActive }) =>
              isActive
                ? "flex gap-2 items-center w-full text-active"
                : "flex gap-2 items-center w-full"
            }
          >
            <User size={18} />
            <p className="font-semibold font-workSans text-md">
              Access Profiles
            </p>
          </NavLink>
        </div>
        <div className="p-2 rounded hover:bg-hover text-sm">
          <NavLink
            to="/security"
            className={({ isActive }) =>
              isActive
                ? "flex gap-2 items-center w-full text-active"
                : "flex gap-2 items-center w-full"
            }
          >
            <ShieldBan size={18} />
            <p className="font-semibold font-workSans text-md">Security</p>
          </NavLink>
        </div>
        <div className="p-2 rounded hover:bg-hover text-sm">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive
                ? "flex gap-2 items-center w-full text-active"
                : "flex gap-2 items-center w-full"
            }
          >
            <Settings size={18} />
            <p className="font-semibold font-workSans text-md">Settings</p>
          </NavLink>
        </div>
        <DropdownMenuSeparator />
        <div className="p-2 rounded hover:bg-hover text-sm">
          <button
            onClick={handleSignOut}
            className="flex gap-2 items-center w-full text-Red-300"
          >
            <LogOut size={18} />
            <p className="font-semibold font-workSans text-md">Logout</p>
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
