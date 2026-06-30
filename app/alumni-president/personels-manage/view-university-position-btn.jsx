import Modal from "@/components/modal";
import { Building2, GraduationCap, X } from "lucide-react";
import { useState } from "react";

const ViewUniversityPosition = () => {
  const data = ["อธิการบดี", "รองอธิการบดี", "คณบดี", "รองคณบดี", "อาจารย์"];
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-1.5 px-2 rounded-full text-xs flex items-center gap-2 bg-gray-100 shadow-sm hover:bg-blue-500 hover:text-white"
      >
        <GraduationCap size={16} />
        <p>ดูข้อมูลตำแหน่ง</p>
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="w-full lg:w-1/3 rounded-lg z-50 bg-white flex flex-col">
          <div className="w-full flex p-5 items-start justify-between">
            <span className="flex flex-col">
              <p className="font-semibold">ข้อมูลตำแหน่ง</p>
              <p className="text-gray-700 text-sm">
                ข้อมูลตำแหน่งที่ระบบรองรับ
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
              ทั้งหมด {data.length} รายการ
            </p>
            <table className="w-full mt-2">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="p-2.5 pb-3 text-start bg-blue-50 font-normal text-sm">
                    ตำแหน่ง
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((f, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="p-2.5 pb-3 text-start text-sm">{f}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-red-500 text-sm m-5">
            *ข้อมูลดังกล่าวมีผลต่อการจัดการสิทธิ์การใช้งานของบุคลากรภายในระบบ
          </p>
        </div>
      </Modal>
    </>
  );
};
export default ViewUniversityPosition;
