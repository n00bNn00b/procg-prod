import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Dispatch } from "react";

interface PaginationProps {
  table: any; // Consider defining a more specific type for `table`
  setPage: Dispatch<React.SetStateAction<number>>;
  //(page: number) => void;
  page: number;
  totalPage: number | undefined;
  currentPage: number | undefined;
}

const Pagination3: React.FC<PaginationProps> = ({
  table,
  setPage,
  page,
  totalPage,
  currentPage,
}) => {
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleLastPrevPage = () => {
    setPage(1);
  };

  const handleLastNextPage = () => {
    if (totalPage) setPage(totalPage);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (totalPage || 1)) {
      setPage(page);
    }
  };

  return (
    <div className="flex items-center justify-end space-x-4 px-2 py-1 bottom-0 bg-white border-t">
      {/* Selected Rows Info */}
      <div className="flex-1 text-sm text-gray-600">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* First Page button */}
        <button
          onClick={handleLastPrevPage}
          disabled={page === 1}
          aria-label="First Page"
          className={`p-1 rounded ${
            page === 1 ? "text-slate-400 bg-slate-200" : "bg-slate-300"
          }`}
        >
          <ChevronFirst size={15} />
        </button>

        {/* Previous Page button */}
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          aria-label="Previous Page"
          className={`p-1 rounded ${
            page === 1 ? "text-slate-400 bg-slate-200" : "bg-slate-300"
          }`}
        >
          <ChevronLeft size={15} />
        </button>

        {/* Page Number Input */}
        <span className="text-sm">Page</span>
        <input
          type="number"
          value={page}
          min={1}
          max={page + 1}
          className="w-12 text-center border rounded-sm text-sm"
          onChange={(e) => handlePageChange(Number(e.target.value))}
        />
        <span className="text-sm">
          of {totalPage} ({currentPage} of {totalPage} pages)
        </span>

        {/* Next Page button */}
        <button
          onClick={handleNextPage}
          disabled={totalPage === page}
          aria-label="Next Page"
          className={`p-1 rounded ${
            totalPage === page ? "text-slate-400 bg-slate-200" : "bg-slate-300"
          }`}
        >
          <ChevronRight size={15} />
        </button>

        {/* Last Page button */}
        <button
          onClick={handleLastNextPage}
          disabled={totalPage === page}
          aria-label="Last Page"
          className={`p-1 rounded ${
            totalPage === page ? "text-slate-400 bg-slate-200" : "bg-slate-300"
          }`}
        >
          <ChevronLast size={15} />
        </button>
      </div>
    </div>
  );
};

export default Pagination3;
