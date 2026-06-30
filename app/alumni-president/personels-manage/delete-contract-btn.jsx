import Modal from "@/components/modal";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";

const DeleteContractBtn = ({ professorId,fetch }) => {
  const [showModal, setShowModal] = useState(false);

  const [reason, setReason] = useState("");
  const [load, setLoad] = useState(false);
  const handleDelete = async () => {
    if (!reason) return alerts.warning("กรุณาระบุเหตุผล");
    const { isConfirmed } = await alerts.confirmDialog(
      "ยืนยันการลบข้อมูลนี้",
      "*ช่องทางการติดต่อของผู้ใช้รายนี้จะถูกลบออกทั้งหมด!",
      "ลบ",
    );
    if (!isConfirmed) return;
    setLoad(true);
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI +
          `/president/delete-professor-contract/${professorId}`,
        { withCredentials: true, params: { reason } },
      );
      if (res.status === 200) {
        alerts.success("ลบช่องทางการติดต่อแล้ว!");
        fetch();
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 px-3 rounded-lg text-sm mt-2 bg-red-500 text-white flex items-center gap-2"
      >
        <Trash2 size={18} />
        <p>ลบช่องทางการติดต่อ</p>
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="w-full lg:w-1/3 flex z-50 flex-col p-5 rounded-lg bg-white">
          <div className="w-full flex items-start justify-between">
            <span className="flex flex-col">
              <p className="font-semibold">กรุณาระบุเหตุผลที่ต้องลบข้อมูลนี้</p>
              <p className="text-sm text-gray-700">
                ระบบจะแจ้งเหตุผลดังกล่าวไปยังอีเมลของผู้ใช้รายนี้
              </p>
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <textarea
            name=""
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="ระบุเหตุผลที่นี่..."
            className="w-full mt-3 text-sm rounded-lg p-2 px-3 shadow-sm border border-gray-300 focus:border-blue-500 outline-0 h-[125px] resize-y"
            id=""
          ></textarea>
          <div className="w-full flex mt-3.5 justify-end items-center gap-2">
            <button className="p-2 px-3 rounded-lg text-sm border border-gray-300 shadow-sm">
              ปิด
            </button>
            <button
              disabled={load}
              onClick={handleDelete}
              className="p-2 px-3 flex items-center gap-2 hover:bg-red-600 rounded-lg text-sm border border-red-300 bg-red-500 text-white shadow-sm"
            >
              {load ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <p>กำลังลบ...</p>
                </>
              ) : (
                <>
                  {" "}
                  <Trash2 size={18} />
                  <p>ยืนยันลบ</p>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default DeleteContractBtn;
