import { createContext, useContext, useState, ReactNode } from "react";

interface DnDContextType {
  type: string | null;
  setType: React.Dispatch<React.SetStateAction<string | null>>;
  label: string | null;
  setLabel: React.Dispatch<React.SetStateAction<string | null>>;
}
const DnDContext = createContext<DnDContextType>({} as DnDContextType);

interface DnDProviderProps {
  children: ReactNode;
}

export const DnDProvider: React.FC<DnDProviderProps> = ({ children }) => {
  const [type, setType] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const values = { type, setType, label, setLabel };
  return <DnDContext.Provider value={values}>{children}</DnDContext.Provider>;
};

export default DnDContext;

export const useDnD = (): DnDContextType => {
  return useContext(DnDContext);
};
