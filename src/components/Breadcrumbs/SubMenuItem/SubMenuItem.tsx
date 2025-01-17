import { MenuData } from "@/components/Sidebar/Sidbar";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const SubMenuItem = (item: MenuData) => {
  // Adjusted props to destructure item
  const [expendMenuName, setExpendMenuName] = useState<string[]>([]);

  const handleExpendMenu = (name: string) => {
    setExpendMenuName((prev) => {
      if (prev.includes(name)) {
        return prev;
      } else {
        return [...prev, name];
      }
    });
  };

  return (
    <>
      {item.menuItems.map((menu) => {
        return (
          <div key={menu.name}>
            {/* Nested Sub Menu Here */}
            {menu.path && (
              <Link
                to={menu.path}
                className="text-blue-600 max-w-max hover:underline inline-block"
              >
                <p>{menu.name}</p>
              </Link>
            )}
            {/* Sub Menu Here */}
            {menu.subItems && (
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleExpendMenu(menu.name)}
              >
                {expendMenuName.includes(menu.name) ? (
                  <Minus size={15} />
                ) : (
                  <Plus size={15} />
                )}
                <p>{menu.name}</p>
              </div>
            )}
            {expendMenuName.includes(menu.name) &&
              menu.subItems &&
              menu.subItems.map((subMenuItem) => {
                return (
                  <div key={subMenuItem.name} className="ml-10">
                    {subMenuItem.path && (
                      <Link
                        to={subMenuItem.path}
                        className="text-blue-600 max-w-max hover:underline inline-block"
                      >
                        <p>{subMenuItem.name}</p>
                      </Link>
                    )}
                  </div>
                );
              })}
          </div>
        );
      })}
    </>
  );
};

export default SubMenuItem;
