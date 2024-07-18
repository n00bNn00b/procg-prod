import { Menu } from "lucide-react";
import { TopNavs } from "./Navs.json";
import logo from "/images/logo.png";
import { NavLink } from "react-router-dom";
import { INav } from "@/types/interfaces/users.interface";

const TopNavBar: React.FC = () => {
  const navs: INav[] = TopNavs;

  return (
    <div className="p-2 flex justify-between bg-slate-100 sticky top-0 shadow-md">
      {/* left side */}
      <div className="flex items-center gap-2">
        <Menu />
        <div>
          <img className="w-24" src={logo} alt="" />
        </div>
      </div>
      {/* right side  */}
      <div className="flex gap-1">
        {navs.map((nav) => {
          return (
            <div key={nav.id}>
              <NavLink to={nav.link}>
                {({ isActive }) => (
                  <div
                    className={`flex items-center justify-center gap-2 px-5 py-[5px] rounded-md duration-300 hover:bg-slate-200 ${
                      isActive ? "bg-slate-300" : ""
                    } ${nav.name === "Profile" && isActive ? " bg-none" : ""} `}
                  >
                    <span>{nav.name}</span>
                  </div>
                )}
              </NavLink>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default TopNavBar;
