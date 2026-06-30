import Modal from "@/components/modal";
import { GraduationCap, Search, X } from "lucide-react";
import { useState } from "react";

const ViewSelectAlumni = ({ selectAlumniId, handleDeleteAlumni }) => {
  const [showModal, setShowModal] = useState(false);


  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center text-xs hover:bg-blue-100 gap-2 p-1.5 px-2.2 mt-2 rounded-full w-fit bg-blue-50 text-blue-500 font-semibold shadow-sm"
      >
        <GraduationCap size={18} />
        <p>ผู้รับ ({selectAlumniId.length} คน)</p>
      </button>
      {/* <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="w-full lg:w-1/3 p-5 rounded-lg flex flex-col bg-white z-50">
          <div className="w-full flex items-start justify-between">
            <span className="flex flex-col">
              <p className="font-semibold text-lg">รายชื่อศิษย์เก่า</p>
              <p className="text-sm text-gray-700">
                ตรวจสอบรายชื่อศิษย์เก่าที่คุณเลือกให้เป็นผู้รับข้อความ
              </p>
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-300 h-[400px] overflow-auto">
            <p>ค้นหา</p>
            <div className="w-full flex items-center mt-1.5 gap-2 flex-wrap">
                <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-300 shadow-sm">
                    <Search size={18}/>
                    <input type="text" className="text-sm w-[90%]" placeholder="พิมพ์ค้นหา" />
                </div>
            </div>
          </div>
        </div>
      </Modal> */}
    </>
  );
};
export default ViewSelectAlumni;
