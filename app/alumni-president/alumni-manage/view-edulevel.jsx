import { BookUser, GraduationCap, X } from "lucide-react";
import { useState } from "react";
import { eduLevels } from "@/data/faculty";
import Modal from "@/components/modal";

const ViewEduLevel = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <>
        <button
          onClick={() => setShowModal(true)}
          className="p-1.5 px-2 rounded-full text-xs flex items-center gap-2 bg-gray-100 shadow-sm hover:bg-blue-500 hover:text-white"
        >
          <GraduationCap size={16} />
          <p>ดูรหัสระดับการศึกษา</p>
        </button>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="w-full lg:w-1/2  rounded-lg z-50 bg-white flex flex-col">
            <div className="w-full flex p-5 items-start justify-between">
              <span className="flex flex-col">
                <p className="font-semibold">รหัสระดับการศึกษา</p>
                <p className="text-gray-700 text-sm">
                  ข้อมูลระดับการศึกษาที่ระบบรองรับ
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
              <p className="mt-2 text-sm text-gray-600">
                ทั้งหมด {eduLevels.length} ระดับการศึกษา
              </p>
              <div className="w-full h-[300px] lg:h-[400px] mt-2.5 overflow-auto ">
                {" "}
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300 sticky top-0">
                      <th className="p-2.5 pb-3 text-start bg-blue-50 font-normal text-sm">
                        รหัส
                      </th>
                      <th className="p-2.5 pb-3 text-start bg-blue-50 font-normal text-sm">
                        ระดับการศึกษา
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {eduLevels?.map((f, index) => (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="p-2.5 pb-3 text-start text-sm border-r border-gray-300">
                          {f?.id}
                        </td>
                        <td className="p-2.5 pb-3 text-start text-sm">
                          {f?.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal>
      </>
    </>
  );
};
export default ViewEduLevel;
