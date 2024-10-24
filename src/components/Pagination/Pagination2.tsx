import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaginationProps {
  table: any; // Adjust this type to match your table instance type if needed
}

const Pagination2: React.FC<PaginationProps> = ({ table }) => {
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();
  const pageIndex = table.getState().pagination.pageIndex + 1; // Page index starts from 0
  const totalPages = table.getPageCount();

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
          onClick={() => table.setPageIndex(0)}
          disabled={!canPreviousPage}
          className={`p-1 rounded ${
            !canPreviousPage ? "text-slate-400 bg-slate-200" : " bg-slate-300"
          }`}
        >
          <ChevronFirst size={15} />
        </button>

        {/* Previous Page button */}
        <button
          onClick={() => table.previousPage()}
          disabled={!canPreviousPage}
          className={`p-1 rounded ${
            !canPreviousPage ? "text-slate-400 bg-slate-200" : " bg-slate-300"
          }`}
        >
          <ChevronLeft size={15} />
        </button>

        {/* Page Number Input */}
        <span className="text-sm">Page</span>
        <input
          type="number"
          value={pageIndex}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
          className="w-12 text-center border rounded-sm text-sm"
        />
        <span className="text-sm">
          of {totalPages} ({pageIndex} of {totalPages} pages)
        </span>

        {/* Next Page button */}
        <button
          onClick={() => table.nextPage()}
          disabled={!canNextPage}
          className={`p-1 rounded ${
            !canNextPage ? "text-slate-400 bg-slate-200" : " bg-slate-300"
          }`}
        >
          <ChevronRight size={15} />
        </button>

        {/* Last Page button */}
        <button
          onClick={() => table.setPageIndex(totalPages - 1)}
          disabled={!canNextPage}
          className={`p-1 rounded ${
            !canNextPage ? "text-slate-400 bg-slate-200" : " bg-slate-300"
          }`}
        >
          <ChevronLast size={15} />
        </button>
      </div>
    </div>
  );
};

export default Pagination2;
