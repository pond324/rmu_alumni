import Modal from "@/components/modal";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { Loader2, X, XCircle } from "lucide-react";
import { useState } from "react";

const DeleteRegisBtn = ({ processing, regisData, alumni, fetch }) => {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [load, setLoad] = useState(processing);
  const handleDeleteRegis = async () => {
    if (!reason)
      return alerts.warning(
        "กรุณาระบุเหตุผลเพื่อแจ้งให้นักศึกษาทราบถึงสาเหตุของการดำเนินการนี้!",
      );
    const { isConfirmed } = await alerts.confirmDialog(
      "ยืนยันยกเลิกการลงทะเบียน!",
      `ข้อมูลการลงทะเบียนของนักศึกษารายนี้จะถูกรีเซ็ตและสถานะของนักศึกษารายนี้จะถูกเปลี่ยนเป็น "ยังไม่ลงทะเบียน"`,
    );
    if (!isConfirmed) return;
    setLoad(true);
    try {
      const res = await axios.put(
        apiConfig.rmuAPI + `/president/delete-alumni-regis/${regisData?.id}`,
        { reason, alumni_id: alumni?.alumni_id },
        { withCredentials: true },
      );
      if (res.status === 200) {
        alerts.success(
          "รีเซ็ตข้อมูลลงทะเบียนศิษย์เก่าสำเร็จ! ระบบได้ส่งข้อความแจ้งเตือนไปยังอีเมลของนักศึกษาคนดังกล่าวแล้ว!",
        );
        fetch();
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
      {" "}
      <button
        disabled={load}
        onClick={() => setShowModal(true)}
        className="p-2.5 px-3.5 rounded-lg flex items-center gap-3.5 text-sm bg-gray-600 text-white"
      >
        {load ? (
          <>
            <Loader2 className="animate-spin" />
            <p>กำลังดำเนินการ...</p>
          </>
        ) : (
          <>
            {" "}
            <XCircle size={16} />
            <p>ยกเลิกการลงทะเบียน</p>
          </>
        )}
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="w-full lg:w-1/3 p-5 z-50 rounded-lg bg-white flex flex-col">
          <div className="w-full flex items-center justify-between">
            <span className="flex flex-col">
              <p className="font-semibold text-lg">
                รีเซ็ตข้อมูลลงทะเบียนศิษย์เก่า
              </p>
              <p className="text-sm text-gray-700">
                ระบุเหตุผลที่ต้องลบข้อมูลการลงทะเบียนศิษย์เก่าของ -{" "}
                {alumni?.prefix}
                {alumni?.fname} {alumni?.lname}
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
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="เช่น หลักฐานไม่ชัดเจน ยอดเงินไม่ตรง..."
            className="mt-5 h-[100px] outline-none w-full p-2 px-3 rounded-lg text-sm border border-gray-300 focus:border-blue-500"
          ></textarea>
          <div className="mt-3 w-full flex justify-end items-center gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="p-2 text-sm px-3.5 rounded-lg border border-gray-300"
            >
              ยกเลิก
            </button>
            <button
              disabled={load}
              onClick={handleDeleteRegis}
              className="p-2 text-sm flex items-center gap-2 px-3.5 rounded-lg border border-red-300 bg-red-500 text-white"
            >
              {load ? (
                <>
                  <Loader2 className="animate-spin" />
                  <p className="mt-1">กำลังดำเนินการ...</p>
                </>
              ) : (
                "ยืนยันการรีเซ็ต"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default DeleteRegisBtn;
