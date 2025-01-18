import SubMenuItem from "@/components/Breadcrumbs/SubMenuItem/SubMenuItem";
import { MenuData } from "@/components/Sidebar/Sidbar";
import menu from "@/Menu/menu.json";

const AsynchronousRequestManager = () => {
  const menus = menu as MenuData[];

  return (
    <div>
      {menus.map((item) => {
        return (
          <div key={item.submenu}>
            {item.submenu === "Asynchronous Request Manager (ARM)" && (
              <SubMenuItem {...item} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AsynchronousRequestManager;
