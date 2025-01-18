import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  menuClasses,
  sidebarClasses,
} from "react-pro-sidebar";
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

export interface MenuData {
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

  const getMenuItemStyle = (path: string) => {
    if (pathname === path) {
      return "text-red-600";
    }
  };

  const getSubMenuStyle = (paths: string[]) => {
    if (paths.includes(pathname)) {
      return "bg-winter-100 border-l-4 border-red-600 duration-300";
    }
  };

  const getSubMenuItemStyle = (paths: string[]) => {
    if (paths.includes(pathname)) {
      // console.log(paths, pathname, "paths, pathname");
      return "bg-winter-300";
    }
  };

  return (
    <Sidebar
      collapsed={!open}
      transitionDuration={1000}
      className="h-[calc(100vh-3rem)] text-[14px] bg-white z-40"
      style={{ position: "fixed" }}
      rootStyles={{
        ["." + sidebarClasses.container]: {
          width: open ? "16.5rem" : "5.2rem",
          borderRight: "1px solid #e5e7eb",
          transition: "1s",
        },
        border: "none",
      }}
    >
      <Menu
        rootStyles={{
          ["." + menuClasses.button]: {
            paddingRight: "10px",
          },
        }}
      >
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
            rootStyles={{
              ["." + menuClasses.label]: {
                whiteSpace: "wrap",
                marginLeft: open ? "0px" : "7px",
              },
              // ["." + menuClasses.icon]: {
              //   marginRight: open ? 0 : 5,
              //   // paddingRight: open ? 0 : 5,
              //   transition: " 0.5s",
              // },
            }}
          >
            {menu.menuItems.map((subMenuItem) =>
              subMenuItem.subItems ? (
                <SubMenu
                  className={getSubMenuItemStyle(subMenuItem.paths!)}
                  key={subMenuItem.name}
                  label={subMenuItem.name}
                  rootStyles={{
                    ["." + menuClasses.root]: {
                      paddingLeft: open ? "0px" : "20px",
                    },
                    ["." + menuClasses.label]: {
                      paddingLeft: open ? "25px" : "0px",
                      marginLeft: "0px",
                    },
                  }}
                >
                  {subMenuItem.subItems.map((subItem) => (
                    <MenuItem
                      className={getMenuItemStyle(subItem.path)}
                      key={subItem.name}
                      component={<Link to={subItem.path} />}
                      rootStyles={{
                        ["." + menuClasses.label]: {
                          paddingLeft: open ? "15px" : "0px",
                          fontSize: "12px",
                        },
                      }}
                    >
                      {subItem.name}
                    </MenuItem>
                  ))}
                </SubMenu>
              ) : (
                <MenuItem
                  className={getMenuItemStyle(subMenuItem.path)}
                  key={subMenuItem.name}
                  component={<Link to={subMenuItem.path} />}
                  rootStyles={{
                    ["." + menuClasses.label]: {
                      marginLeft: open ? "35px" : "0px",
                      fontSize: "12px",
                    },
                  }}
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
