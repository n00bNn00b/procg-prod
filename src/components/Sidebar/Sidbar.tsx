import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import menu from "@/Menu/menu.json";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";

interface MenuItems {
  name: string;
  icon: string;
  path: string;
}

interface MenuData {
  submenu: string;
  submenuIcon: string;
  menuItems: MenuItems[];
  paths: string[];
}

const Sidbar = () => {
  const { open } = useGlobalContext();
  const location = useLocation();
  const pathname = location.pathname;

  const menuData: MenuData[] = menu;

  const getMenuitemStyle = (path: string) => {
    if (pathname === path) {
      return "text-rose-600";
    }
  };

  const getSubMenuStyle = (paths: string[]) => {
    if (paths.includes(pathname)) {
      return "bg-blue-100 border-l-4 border-red-600";
    }
  };

  return (
    <Sidebar
      collapsed={!open}
      transitionDuration={1000}
      className="h-[calc(100vh-3rem)] text-[13px] bg-white z-40"
      style={{ position: "fixed" }}
    >
      <Menu className="font-lora font-semibold">
        {menuData.map((menu) => (
          <SubMenu
            className={getSubMenuStyle(menu.menuItems.map((item) => item.path))}
            key={menu.submenu}
            label={menu.submenu}
            icon={<img src={menu.submenuIcon} className="w-[20px] h-[20px]" />}
          >
            {menu.menuItems.map((item) => (
              <MenuItem
                className={getMenuitemStyle(item.path)}
                style={{ fontSize: "11px" }}
                key={item.name}
                component={<Link to={item.path} />}
              >
                <p>{item.name}</p>
              </MenuItem>
            ))}
          </SubMenu>
        ))}
      </Menu>
    </Sidebar>
  );
};

export default Sidbar;
