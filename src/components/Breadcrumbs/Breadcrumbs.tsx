import { Link, useLocation } from "react-router-dom";
import menuData from "../../Menu/menu.json";
import { ChevronRight } from "lucide-react";

const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const breadcrumbs = [{ name: "Home", path: "/" }];
  let currentPath = "";

  for (const segment of pathSegments) {
    currentPath += `/${segment}`;
    let found = false;

    menuData.forEach((menu) => {
      if (menu.path === currentPath) {
        breadcrumbs.push({ name: menu.submenu, path: menu.path });
        found = true;
      }
      menu.menuItems.forEach((item) => {
        if (item.path === currentPath) {
          breadcrumbs.push({ name: item.name, path: item.path });
          found = true;
        }
        item.subItems?.forEach((sub) => {
          if (sub.path === currentPath) {
            breadcrumbs.push({ name: sub.name, path: sub.path });
            found = true;
          }
        });
      });
    });
    if (!found)
      breadcrumbs.push({ name: segment.replace(/-/g, " "), path: currentPath });
  }

  return (
    <nav className="my-2 flex items-center">
      {breadcrumbs.map((item, index) => (
        <span key={item.path}>
          {index < breadcrumbs.length - 1 ? (
            <Link
              to={item.path}
              className="breadcrumb-link underline text-blue-600"
            >
              {item.name}
            </Link>
          ) : (
            <span className="breadcrumb-current">{item.name}</span>
          )}
          {index < breadcrumbs.length - 1 && (
            <span>
              <ChevronRight strokeWidth={1} className="mx-2 inline-block" />
            </span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
