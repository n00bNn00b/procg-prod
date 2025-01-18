import { useParams } from "react-router-dom";
import SubSubMenuItem from "@/components/Breadcrumbs/SubSubMenuItem/SubSubMenuItem";
import { MenuData } from "@/components/Sidebar/Sidbar";
import menu from "@/Menu/menu.json";
const DynamicSubSubMenu = () => {
  const menus = menu as MenuData[];

  const { route } = useParams();
  const name = route?.split("-").join(" ");
  console.log(name, "title");

  return (
    <div>
      {menus.map((item) => {
        return (
          <div key={item.submenu}>
            {item.menuItems.map((menu) => {
              return (
                <div key={menu.name}>
                  {menu.name.toLowerCase() === name && menu.subItems && (
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
export default DynamicSubSubMenu;
// {
//   item.submenu === "Enterprise Security Controls" &&
//     item.menuItems.map((menu) => {
//       return (
//         <div key={menu.name}>
//           {/* Change menu name here */}
//           {menu.name === "Access Models" && menu.subItems && (
//             <SubSubMenuItem {...menu} />
//           )}
//         </div>
//       );
//     });
// }
