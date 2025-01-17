import SubSubMenuItem from "@/components/Breadcrumbs/SubSubMenuItem/SubSubMenuItem";
import { MenuData } from "@/components/Sidebar/Sidbar";
import menu from "@/Menu/menu.json";
const Development = () => {
  const menus = menu as MenuData[];

  return (
    <div>
      {menus.map((item) => {
        return (
          <div key={item.submenu}>
            {item.submenu === "Async. Request Manager (ARM)" &&
              item.menuItems.map((menu) => {
                return (
                  <div key={menu.name}>
                    {/* Change menu name here */}
                    {menu.name === "Development" && menu.subItems && (
                      <SubSubMenuItem {...menu} />
                    )}
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
};
export default Development;
