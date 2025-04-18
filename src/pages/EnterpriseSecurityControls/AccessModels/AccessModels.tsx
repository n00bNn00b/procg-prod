import SubSubMenuItem from "@/components/Breadcrumbs/SubSubMenuItem/SubSubMenuItem";
import { MenuData } from "@/components/Sidebar/Sidbar";
import menu from "@/Menu/menu.json";
const AccessModels = () => {
  const menus = menu as MenuData[];

  return (
    <div>
      {menus.map((item) => {
        return (
          <div key={item.submenu}>
            {item.submenu === "Enterprise Security Controls" &&
              item.menuItems.map((menu) => {
                return (
                  <div key={menu.name}>
                    {/* Change menu name here */}
                    {menu.name === "Access Models" && menu.subItems && (
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
export default AccessModels;
