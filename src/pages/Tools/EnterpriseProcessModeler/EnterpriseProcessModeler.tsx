import SubSubMenuItem from "@/components/Breadcrumbs/SubSubMenuItem/SubSubMenuItem";
import { MenuData } from "@/components/Sidebar/Sidbar";
import menu from "@/Menu/menu.json";
const EnterpriseProcessModeler = () => {
  const menus = menu as MenuData[];

  return (
    <div>
      {menus.map((item) => {
        return (
          <div key={item.submenu}>
            {/* Change submenu name here */}
            {item.submenu === "Tools" &&
              item.menuItems.map((menu) => {
                return (
                  <div key={menu.name}>
                    {/* Change menu name here */}
                    {menu.name === "Enterprise Process Modeler" &&
                      menu.subItems && <SubSubMenuItem {...menu} />}
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
};
export default EnterpriseProcessModeler;
