import Modal from "@/components/modal";
import RowLoader from "@/components/row-loader";
import { useFacultyDep } from "@/hook/useFacultyDep";
import { Building2, X } from "lucide-react";
import { useState } from "react";

const ViewFaculty = () => {
  const { faculties, loadData } = useFacultyDep();
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-1.5 px-2 rounded-full text-xs flex items-center gap-2 bg-gray-100 shadow-sm hover:bg-blue-500 hover:text-white"
      >
        <Building2 size={16} />
        <p>ดูรหัสคณะ</p>
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="w-full lg:w-1/3 h-[600px] overflow-auto rounded-lg z-50 bg-white flex flex-col">
          <div className="w-full flex p-5 items-start justify-between">
            <span className="flex flex-col">
              <p className="font-semibold">รหัสคณะ</p>
              <p className="text-gray-700 text-sm">
                ข้อมูลรหัสคณะและชื่อคณะ ที่ระบบรองรับ
              </p>
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <div className="p-5 pt-5 border-t border-gray-300 w-full">
            <p className="text-sm text-gray-600">
              ทั้งหมด {faculties.length - 1} รายการ
            </p>
            <table className="w-full mt-2">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="p-2.5 pb-3 text-start bg-blue-50 font-normal text-sm">
                    รหัส
                  </th>
                  <th className="p-2.5 pb-3 text-start bg-blue-50 font-normal text-sm">
                    ชื่อคณะ
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadData ? (
                  <RowLoader numcol={2} />
                ) : (
                  faculties?.map((f, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="p-2.5 pb-3 text-start text-sm border-r border-gray-300">
                        {f?.id}
                      </td>
                      <td className="p-2.5 pb-3 text-start text-sm">
                        {f?.name}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ViewFaculty;
