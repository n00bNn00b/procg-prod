import { AttributesProps } from "../shape/types";

interface NodeDataProps {
  label: string;
  attributes: AttributesProps[];
}

const NodeData = ({ label, attributes }: NodeDataProps) => {
  return (
    // <input type="text" className="node-label" placeholder={props.placeholder} />
    <div className="node-label">
      <h3>{label}</h3>
      {attributes.map((attribute) => (
        <div key={attribute.id} className="flex items-center">
          <span className="w-1 h-1 rounded-full mr-1 bg-black"></span>
          <span>{attribute.value}</span>
        </div>
      ))}
    </div>
  );
};

export default NodeData;
