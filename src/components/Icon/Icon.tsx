import { icons } from "lucide-react";
import React from "react";

type LucideIconName = keyof typeof icons;

interface IIconProps {
  name: LucideIconName;
  color?: string;
  size?: number;
}

const Icon: React.FC<IIconProps> = ({ name, color, size }) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    console.error(`Icon '${name}' not found in Lucide icons.`);
    return null;
  }

  return <LucideIcon color={color} size={size} />;
};

export default Icon;
