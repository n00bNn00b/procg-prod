import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React from "react";

interface Pagination4Props {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPageNumbers: number;
  paginationArray: number[];
}

const Pagination4 = ({
  currentPage,
  setCurrentPage,
  totalPageNumbers,
  paginationArray,
}: Pagination4Props) => {
  const handleNext = () => {
    if (totalPageNumbers > currentPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleLast = () => {
    setCurrentPage(totalPageNumbers);
  };

  const handleFirst = () => {
    setCurrentPage(1);
  };
  return (
    <div className="flex gap-4 items-center">
      <button
        onClick={handleFirst}
        className={
          currentPage === 1
            ? "p-1 rounded-md bg-winter-100/30"
            : "p-1 rounded-md bg-winter-100"
        }
        disabled={currentPage === 1}
      >
        <ChevronFirst
          strokeWidth={1.5}
          size={15}
          className={currentPage === 1 ? "text-slate-300" : "text-black"}
        />
      </button>
      <button
        onClick={handlePrevious}
        className={
          currentPage === 1
            ? "p-1 rounded-md bg-winter-100/30"
            : "p-1 rounded-md bg-winter-100"
        }
        disabled={currentPage === 1}
      >
        <ChevronLeft
          strokeWidth={1.5}
          size={15}
          className={currentPage === 1 ? "text-slate-300" : "text-black"}
        />
      </button>
      <select
        value={currentPage}
        className=" px-1 bg-winter-100 rounded-md"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setCurrentPage(parseInt(e.target.value))
        }
        disabled={paginationArray.length === 1}
      >
        {paginationArray.map((page) => (
          <option className="bg-white" key={page} value={page}>
            {page}
          </option>
        ))}
      </select>
      <button
        onClick={handleNext}
        className={
          currentPage === totalPageNumbers
            ? "p-1 rounded-md bg-winter-100/30"
            : "p-1 rounded-md bg-winter-100"
        }
        disabled={
          currentPage === totalPageNumbers && paginationArray.length === 1
        }
      >
        <ChevronRight
          strokeWidth={1.5}
          size={15}
          className={
            currentPage === totalPageNumbers ? "text-slate-300" : "text-black"
          }
        />
      </button>
      <button
        onClick={handleLast}
        className={
          currentPage === totalPageNumbers
            ? "p-1 rounded-md bg-winter-100/30"
            : "p-1 rounded-md bg-winter-100"
        }
        disabled={
          currentPage === totalPageNumbers && paginationArray.length === 1
        }
      >
        <ChevronLast
          strokeWidth={1.5}
          size={15}
          className={
            currentPage === totalPageNumbers ? "text-slate-300" : "text-black"
          }
        />
      </button>
    </div>
  );
};

export default Pagination4;
