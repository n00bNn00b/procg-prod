import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Settings, ShieldBan, User } from "lucide-react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";

const Dropdown = () => {
  const { token, setToken } = useGlobalContext();
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.setItem("token", JSON.stringify({ access_token: "" }));
    localStorage.setItem("user_name", "");
    setToken({ access_token: "", user_name: "" });
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar>
          <AvatarImage
            className="object-cover object-center"
            src="https://github.com/shadcn.png"
          />
          <AvatarFallback>PF</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel className=" font-bold font-workSans text-lg">
          {token.user_name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "flex gap-2 items-center w-full text-Red-400"
                : "flex gap-2 items-center w-full text-winter-500"
            }
          >
            <User size={18} />
            <p className="font-semibold font-workSans text-md">Profile</p>
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
