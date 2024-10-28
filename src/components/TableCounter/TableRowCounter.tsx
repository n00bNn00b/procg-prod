interface TableRowCounterProps {
  startNumber: number;
  endNumber: number;
  totalNumber: number;
}

const TableRowCounter = ({
  startNumber,
  endNumber,
  totalNumber,
}: TableRowCounterProps) => {
  return <p>{`${startNumber}-${endNumber} of ${totalNumber}`}</p>;
};

export default TableRowCounter;
