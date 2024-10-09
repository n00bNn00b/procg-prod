import { Button } from "@/components/ui/button";
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
    <div className="flex items-center justify-end space-x-4 px-2 py-2 bottom-0 bg-white border-t">
      {/* Selected Rows Info */}
      <div className="flex-1 text-sm text-gray-600">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* First Page Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!canPreviousPage}
          className="bg-slate-300"
        >
          <ChevronFirst />
        </Button>

        {/* Previous Page Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!canPreviousPage}
          className="bg-slate-300"
        >
          <ChevronLeft />
        </Button>

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

        {/* Next Page Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!canNextPage}
          className="bg-slate-300"
        >
          <ChevronRight />
        </Button>

        {/* Last Page Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(totalPages - 1)}
          disabled={!canNextPage}
          className="bg-slate-300"
        >
          <ChevronLast />
        </Button>
      </div>
    </div>
  );
};

export default Pagination2;
