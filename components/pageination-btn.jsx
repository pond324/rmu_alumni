import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationBtn = ({ prevPage, page, totalPage, forwardPage }) => {
  return (
    <div className="flex items-center gap-4 text-sm">
      <button
        type="button"
        onClick={prevPage}
        className="p-2 rounded-lg shadow-md text-sm text-white bg-blue-500 hover:bg-blue-600"
      >
        <ChevronLeft size={18} />
      </button>
      <p>
        หน้า {page} จาก {totalPage}
      </p>
      <button
        type="button"
        onClick={forwardPage}
        className="p-2 rounded-lg shadow-md text-sm text-white bg-blue-500 hover:bg-blue-600"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
export default PaginationBtn;
