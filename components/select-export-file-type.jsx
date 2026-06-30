import { FileSpreadsheet, FileText } from "lucide-react";

const SelectExportFileType = ({ setSelectFileType, selectFileType }) => {
  return (
    <div className="flex items-center gap-3 mt-1.5">
      <button
        onClick={() => setSelectFileType(1)}
        className={`${selectFileType === 1 ? "border-blue-500 bg-blue-50 " : "hover:bg-gray-50 border-gray-300"}  p-3 flex-1 rounded-lg flex flex-col items-center border shadow-xs`}
      >
        <FileSpreadsheet className="text-blue-500" size={25} />
        <p>Excel</p>
        <p className="text-gray-700 text-sm">รายชื่อ</p>
      </button>
      <button
        onClick={() => setSelectFileType(2)}
        className={`${selectFileType === 2 ? "border-blue-500 bg-blue-50 " : "hover:bg-gray-50 border-gray-300"}  p-3 flex-1 rounded-lg flex flex-col items-center border shadow-xs`}
      >
        <FileText className="text-blue-500" size={25} />
        <p>PDF</p>
        <p className="text-gray-700 text-sm">ข้อมูล/ภาพรวม/กราฟ</p>
      </button>
    </div>
  );
};
export default SelectExportFileType;
