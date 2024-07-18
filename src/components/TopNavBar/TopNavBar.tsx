import { Menu, UserCircle } from "lucide-react";
import { TopNavs, Profile } from "./Navs.json";
import logo from "/images/logo.png";
import { Link, NavLink, useLocation } from "react-router-dom";
import { INav, IProfile } from "@/types/interfaces/users.interface";
import Icon from "../Icon/Icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TopNavBar: React.FC = () => {
  const navs: INav[] = TopNavs;
  const profile: IProfile[] = Profile;
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="px-4 py-2 flex justify-between bg-slate-100 sticky top-0 shadow-md">
      {/* left side */}
      <div className="flex items-center gap-2">
        <Menu />
        <div className="flex">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-28" />
          </Link>
          <span className="text-blue-400 inline-block mt-3 tracking-tighter">
            Advanced Controls
          </span>
        </div>
      </div>
      {/* right side */}
      <div className="flex gap-3 items-center justify-center">
        {navs.map((nav) => (
          <div key={nav.id}>
            <NavLink to={nav.link}>
              {({ isActive }) => (
                <div
                  className={`flex items-center justify-center gap-2 px-5 py-[5px] rounded-md duration-300 hover:bg-slate-200 ${
                    isActive ? "bg-slate-300" : ""
                  } ${nav.name === "Profile" && isActive ? "bg-none" : ""} `}
                >
                  <Icon name={nav.icon as any} color="black" size={24} />
                  <span>{nav.name}</span>
                </div>
              )}
            </NavLink>
          </div>
        ))}
        {/* profile DropdownMenu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative">
            <UserCircle />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2 p-2">
            <DropdownMenuLabel className="text-center">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="border-l-[15px] border-l-transparent border-b-[25px] border-b-white border-r-[15px] border-r-transparent absolute right-3 -top-4 duration-500 transition-transform border" />
            {profile.map((p) => (
              <DropdownMenuItem key={p.id} className="my-2 border">
                <NavLink
                  to={p.link}
                  // onClick={p.name === "Logout" ? logout : undefined}
                  className={`${
                    path === p.link && "text-red-500"
                  } flex gap-3 p-1 w-48 cursor-pointer`}
                >
                  <Icon name={p.icon as any} size={24} />
                  <span>{p.name}</span>
                </NavLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNavBar;
