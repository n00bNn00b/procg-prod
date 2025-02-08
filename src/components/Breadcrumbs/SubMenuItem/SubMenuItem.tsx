import { MenuData } from "@/components/Sidebar/Sidbar";
import { Plus } from "lucide-react";
// import { useState } from "react";
import { Link } from "react-router-dom";

const SubMenuItem = (item: MenuData) => {
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
            <div className="flex flex-col">
              {/* Sub Menu Here */}
              {menu.paths && (
                <Link
                  to={menu.name.split(" ").join("-").toLowerCase()}
                  className="flex gap-2 items-center max-w-max hover:underline"
                >
                  <Plus size={15} />
                  <p>{menu.name}</p>
                </Link>
              )}
            </div>
            {/* {menu.subItems && (
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
            )} */}
            {/* {expendMenuName.includes(menu.name) &&
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
              })} */}
          </div>
        );
      })}
    </>
  );
};

export default SubMenuItem;
