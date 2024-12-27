import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
const DefaultLogo = "../../../public/profile/loading.gif";

// import { useEffect } from "react";

const Dropdown = () => {
  const api = useAxiosPrivate();
  const { token, setToken, combinedUser, isCombinedUserLoading } =
    useGlobalContext();
  const { handleDisconnect } = useSocketContext();
  const navigate = useNavigate();
  const profileLogo = isCombinedUserLoading
    ? DefaultLogo
    : combinedUser?.profile_picture
    ? `${import.meta.env.VITE_API_URL}/${combinedUser.profile_picture}`
    : `${import.meta.env.VITE_API_URL}/uploads/profiles/default/loading.gif`;

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
  };
  const handleSignOut = async () => {
    await api.get(`/logout`);
    localStorage.removeItem("loggedInUser");
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
            src={profileLogo}
          />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel className=" font-bold font-workSans text-lg">
          {token.user_name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <NavLink
            to="/access-profiles"
            className={({ isActive }) =>
              isActive
                ? "flex gap-2 items-center w-full text-Red-400"
                : "flex gap-2 items-center w-full text-winter-500"
            }
          >
            <User size={18} />
            <p className="font-semibold font-workSans text-md">
              Access Profiles
            </p>
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <NavLink
            to="/security"
            className={({ isActive }) =>
              isActive
                ? "flex gap-2 items-center w-full text-Red-400"
                : "flex gap-2 items-center w-full text-winter-500"
            }
          >
            <ShieldBan size={18} />
            <p className="font-semibold font-workSans text-md">Security</p>
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive
                ? "flex gap-2 items-center w-full text-Red-400"
                : "flex gap-2 items-center w-full text-winter-500"
            }
          >
            <Settings size={18} />
            <p className="font-semibold font-workSans text-md">Settings</p>
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button
            onClick={handleSignOut}
            className="flex gap-2 items-center w-full text-Red-200"
          >
            <LogOut size={18} />
            <p className="font-semibold font-workSans text-md">Logout</p>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
