import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import menu from "@/Menu/menu.json";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";

interface SubMenuItems {
  name: string;
  icon: string;
  path: string;
}
export interface MenuItems {
  name: string;
  icon: string;
  path: string;
  paths?: string[] | undefined;
  subItems?: SubMenuItems[];
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

  const menuData = menu as MenuData[];

  const getMenuitemStyle = (path: string) => {
    if (pathname === path) {
      return "text-red-600";
    }
  };

  const getSubMenuStyle = (paths: string[]) => {
    if (paths.includes(pathname)) {
      return "bg-winter-100 border-l-4 border-red-600";
    }
  };

  const getSubMenuItemStyle = (paths: string[]) => {
    if (paths.includes(pathname)) {
      console.log(paths, pathname, "paths, pathname");
      return "bg-winter-300";
    }
  };

  return (
    <Sidebar
      collapsed={!open}
      transitionDuration={1000}
      className="h-[calc(100vh-3rem)] text-[13px] bg-white z-40"
      style={{ position: "fixed" }}
    >
      <Menu>
        {menuData.map((menu) => (
          <SubMenu
            className={getSubMenuStyle(menu.paths)}
            key={menu.submenu}
            label={menu.submenu}
            icon={
              menu.submenuIcon && (
                <img
                  src={menu.submenuIcon}
                  alt={`${menu.submenu} icon`}
                  className="w-[20px] h-[20px]"
                />
              )
            }
          >
            {menu.menuItems.map((subMenuItem) =>
              subMenuItem.subItems ? (
                <SubMenu
                  className={getSubMenuItemStyle(subMenuItem.paths!)}
                  key={subMenuItem.name}
                  label={subMenuItem.name}
                >
                  {subMenuItem.subItems.map((subItem) => (
                    <MenuItem
                      className={getMenuitemStyle(subItem.path)}
                      style={{ fontSize: "11px" }}
                      key={subItem.name}
                      component={<Link to={subItem.path} />}
                    >
                      {subItem.name}
                    </MenuItem>
                  ))}
                </SubMenu>
              ) : (
                <MenuItem
                  className={getMenuitemStyle(subMenuItem.path)}
                  style={{ fontSize: "11px" }}
                  key={subMenuItem.name}
                  component={<Link to={subMenuItem.path} />}
                >
                  {subMenuItem.name}
                </MenuItem>
              )
            )}
          </SubMenu>
        ))}
      </Menu>
    </Sidebar>
  );
};

export default Sidbar;
