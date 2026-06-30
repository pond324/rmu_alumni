import Modal from "@/components/modal";
import { Download, FileText, X } from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const ViewAlumniData = () => {
  const [showModal, setShowModal] = useState(false);
  const [alumniExList, setAlumniExList] = useState([]);

  useEffect(() => {
    const loadExcel = async () => {
      const response = await fetch("/files/students_ex.xlsx");

      const arrayBuffer = await response.arrayBuffer();

      const workbook = XLSX.read(arrayBuffer, {
        type: "array",
      });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const data = XLSX.utils.sheet_to_json(sheet, {
        raw: false,
      });

      setAlumniExList(data);
    };

    loadExcel();
  }, []);
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-1.5 px-2 rounded-full text-xs flex items-center gap-2 bg-gray-100 shadow-sm hover:bg-blue-500 hover:text-white"
      >
        <FileText size={16} />
        <p>ดูตัวอย่างข้อมูลนำเข้า</p>
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="w-full lg:w-auto rounded-lg bg-white z-50 flex flex-col">
          <div className="w-full flex items-start justify-between p-5 border-b border-gray-300">
            <span className="flex flex-col">
              <p className="font-semibold">ตัวอย่างข้อมูลนำเข้า</p>
              <p className="text-gray-700 text-sm">
                ตัวอย่างข้อมูลที่ระบบรองรับ
              </p>
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <div className="w-full p-5 flex flex-col">
            <span className="w-full flex items-center justify-between">
              <p className="text-sm text-gray-700">
                *ข้อมูลดังกล่าวเป็นข้อมูลตัวอย่างเพียงเท่านั้น!
              </p>
              <a
                href="/files/students_ex.xlsx"
                download={true}
                className="text-sm p-1.5 px-2.5 hover:bg-blue-500 hover:text-white flex items-center gap-2 rounded-lg bg-gray-100"
              >
                <Download size={18} />
                <p>ดาวน์โหลด</p>
              </a>
            </span>
            <div className="w-full mt-2 h-[450px] overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300 bg-blue-50 sticky top-0">
                    {alumniExList[0] &&
                      Object.keys(alumniExList[0]).map((key) => (
                        <th
                          className="font-normal p-2.5 pb-3 text-sm text-start"
                          key={key}
                        >
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {alumniExList.map((row, index) => (
                    <tr className="border-b border-gray-300" key={index}>
                      {Object.values(row).map((value, i) => (
                        <td
                          className={`text-sm p-2.5 pb-3 ${index <= alumniExList.length - 1 && "border-r border-gray-300"}`}
                          key={i}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ViewAlumniData;
