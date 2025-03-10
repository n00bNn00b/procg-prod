interface IAddAttributeProps {
  attributeName: string;
  setAttributeName: React.Dispatch<React.SetStateAction<string>>;
  handleAddAttribute: () => void;
  setIsAddAttribute: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddAttribute = ({
  attributeName,
  setAttributeName,
  handleAddAttribute,
  setIsAddAttribute,
}: IAddAttributeProps) => {
  return (
    <div className="absolute left-[50%] z-50 translate-x-[-50%] bg-slate-300 p-3 border rounded">
      <form>
        <input
          type="text"
          value={attributeName ?? ""}
          placeholder="Attribute Name"
          onChange={(e) => {
            setAttributeName(e.target.value);
          }}
          autoFocus
          className="px-2 py-1 rounded mr-2"
        />
        <button
          className="bg-slate-200 p-1 rounded-l-md border-black border hover:bg-slate-300 hover:shadow"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddAttribute();
            setIsAddAttribute(false);
          }}
        >
          Save
        </button>
        <button
          className="bg-slate-200 p-1 rounded-r-md border-black border hover:bg-slate-300 hover:shadow"
          onClick={(e) => {
            e.preventDefault();
            setIsAddAttribute(false);
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddAttribute;
