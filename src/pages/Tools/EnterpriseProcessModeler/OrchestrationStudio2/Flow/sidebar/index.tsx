import SidebarItem from "./sidebar-item";
import { ShapeComponents, ShapeType } from "../shape/types";

function Sidebar() {
  return (
    <div className="sidebar p-2">
      <div className="sidebar-label">Drag shapes to the canvas</div>
      <div className="sidebar-items">
        {Object.keys(ShapeComponents).map((type) => (
          <SidebarItem type={type as ShapeType} key={type} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
