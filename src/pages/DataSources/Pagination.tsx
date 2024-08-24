import { Button } from "@/components/ui/button";

const Pagination = ({ table }: any) => {
  return (
    <div className="flex items-center justify-end space-x-2 px-2 bottom-0 bg-white py-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
        {/* <pre>{JSON.stringify(table.getState().rowSelection)}</pre> */}
      </div>
      <div className="space-x-2 ">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="bg-slate-300"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="bg-slate-300"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
export default Pagination;
