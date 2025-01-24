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
      return "text-red-600 bg-white rounded-md";
    } else {
      return "bg-[#F3F8FF]";
    }
  };

  const getSubMenuStyle = (paths: string[]) => {
    if (paths.includes(pathname)) {
      return "bg-winter-100 duration-500 rounded-md";
    } else {
      // return "bg-[#E4E4E766]";
      return " ";
    }
  };

  const getSubMenuItemStyle = (paths: string[]) => {
    if (paths.includes(pathname)) {
      // console.log(paths, pathname, "paths, pathname");
      return "bg-[#F3F8FF] ";
    } else {
      return "bg-[#F3F8FF]";
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
          width: open ? "18rem" : "5rem",
          // right sidebar border
          borderRight: "1px solid #e5e7eb",
          transition: "1s",
          paddingRight: 10,
          paddingLeft: 10,
        },
        border: "none",
      }}
    >
      <Menu
        rootStyles={{
          ["." + menuClasses.button]: {
            paddingLeft: 0,
            paddingRight: 10,
            ":hover": {
              background: "#B4C4D9",
            },
          },
          ["." + menuClasses.subMenuContent]: {
            width: open ? "100%" : 250,
            borderEndStartRadius: 5,
            borderEndEndRadius: 5,
            paddingRight: open ? 10 : 5,
            paddingLeft: open ? 20 : 5,
            backgroundColor: "#F3F8FF",
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
              ["." + menuClasses.button]: {
                ":hover": {
                  borderRadius: 5,
                },
              },
              ["." + menuClasses.label]: {
                whiteSpace: "wrap",
                marginLeft: open ? 0 : 7,
              },
            }}
          >
            {menu.menuItems.map((subMenuItem) =>
              subMenuItem.subItems ? (
                <SubMenu
                  className={`my-1 ${getSubMenuItemStyle(subMenuItem.paths!)}`}
                  key={subMenuItem.name}
                  label={subMenuItem.name}
                  rootStyles={{
                    ["." + menuClasses.label]: {
                      paddingLeft: open ? 25 : 0,
                    },
                    ["." + menuClasses.menuItemRoot]: {
                      width: open ? "100%" : "95.5%",
                    },
                  }}
                >
                  {subMenuItem.subItems.map((subItem) => (
                    <MenuItem
                      className={`my-1 ${getMenuItemStyle(subItem.path)}`}
                      key={subItem.name}
                      component={<Link to={subItem.path} />}
                      rootStyles={{
                        ["." + menuClasses.label]: {
                          paddingLeft: open ? 20 : 17,
                          marginLeft: 0,
                          fontSize: 12,
                        },
                      }}
                    >
                      <div className="flex gap-2 items-center">
                        <span
                          className={`w-[1px] h-[1px] p-[2px] rounded-full bg-current  `}
                        />
                        <>{subItem.name}</>
                      </div>
                    </MenuItem>
                  ))}
                </SubMenu>
              ) : (
                <MenuItem
                  className={`my-1 ${getMenuItemStyle(subMenuItem.path)}`}
                  key={subMenuItem.name}
                  component={<Link to={subMenuItem.path} />}
                  rootStyles={{
                    ["." + menuClasses.label]: {
                      paddingLeft: open ? 27 : 10,
                      marginLeft: 0,
                      fontSize: 12,
                    },
                  }}
                >
                  <div className="flex gap-2 items-center">
                    <span
                      className={`w-[1px] h-[1px] p-[2px] rounded-full bg-current  `}
                    />
                    <>{subMenuItem.name}</>
                  </div>
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
