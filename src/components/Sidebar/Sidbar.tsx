import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  menuClasses,
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
      return "bg-winter-100 border-l-4 border-red-600";
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
      className="h-[calc(100vh-3rem)] text-[13px] bg-white z-40"
      style={{ position: "fixed" }}
    >
      <Menu
        rootStyles={{
          ["." + menuClasses.button]: {
            paddingRight: "10px ",
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
                marginLeft: open ? "0px" : "10px",
                // paddingRight: "2px",
                // open? {display: "block"} : { display: "none" },
                // display none when collapsed
                // display: open ? "block" : "hide",
                // duration 5s delay
                // transition: "0.5s",
              },
              ["." + menuClasses.icon]: {
                marginRight: open ? 0 : 5,
                paddingRight: "10px",
                transition: " 0.5s",
              },
              // ["." + menuClasses.subMenuRoot]: {
              //   marginLeft: "30px",
              //   borderLeft: "2px solid green",
              // },
              // ["." + menuClasses.menuItemRoot]: {
              //   margin: "0px 30px",
              //   borderLeft: "2px solid green",
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
                    ["." + menuClasses.subMenuRoot]: {
                      width: open ? "200px" : "50px",
                    },
                    ["." + menuClasses.root]: {
                      paddingLeft: "20px",
                    },
                    // ["." + menuClasses.label]: {
                    //   paddingLeft: "5px",
                    // },
                  }}
                >
                  {subMenuItem.subItems.map((subItem) => (
                    <MenuItem
                      className={getMenuItemStyle(subItem.path)}
                      style={{ fontSize: "11px" }}
                      key={subItem.name}
                      component={<Link to={subItem.path} />}
                      // rootStyles={{
                      //   ["." + menuClasses.label]: {
                      //     paddingLeft: "5px",
                      //   },
                      // }}
                    >
                      {subItem.name}
                    </MenuItem>
                  ))}
                </SubMenu>
              ) : (
                <MenuItem
                  className={getMenuItemStyle(subMenuItem.path)}
                  style={{ fontSize: "11px" }}
                  key={subMenuItem.name}
                  component={<Link to={subMenuItem.path} />}
                  // rootStyles={{
                  //   ["." + menuClasses.label]: {
                  //     paddingLeft: "5px",
                  //   },
                  // }}
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
