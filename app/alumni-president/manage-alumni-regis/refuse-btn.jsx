import Modal from "@/components/modal";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { Loader2, X, XCircle } from "lucide-react";
import { useState } from "react";

const RefuseBtn = ({ regisData, fetch, load }) => {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(load);
  const handleRefuse = async () => {
    if (!reason)
      return alerts.warning("กรุณาระบุเหตุผลเพื่อให้ผู้ลงทะเบียนทราบ");
    const { isConfirmed } = await alerts.confirmDialog(
      "ยืนยันปฏิเสธการลงทะเบียน",
      "คุณต้องการปฏิเสธคำขอลงทะเบียนของนักศึกษารายนี้?",
    );
    if (!isConfirmed) return;
    setLoading(true);
    try {
      const res = await axios.put(
        apiConfig.rmuAPI + `/president/refuse-regis-alumni/${regisData?.id}`,
        { reason },
        { withCredentials: true },
      );
      if (res.status === 200) {
        alerts.success(
          "ปฏิเสธคำขอลงทะเบียน! ระบบได้ส่งข้อความแจ้งเตือนไปยังอีเมลของนักศึกษาแล้ว!",
        );
        fetch();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {" "}
      <button
        onClick={() => setShowModal(true)}
        className="p-2.5 px-3.5 rounded-lg flex items-center gap-3.5 text-sm bg-red-600 text-white"
      >
        <XCircle size={16} />
        <p>ปฏิเสธ</p>
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="w-full lg:w-1/3 p-5 z-50 rounded-lg bg-white flex flex-col">
          <div className="w-full flex items-center justify-between">
            <span className="flex flex-col">
              <p className="font-semibold text-lg">ปฏิเสธคำขอลงทะเบียน</p>
              <p className="text-sm text-gray-700">
                ระบุเหตุผลให้ผู้ลงทะเบียนทราบ
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
              disabled={loading}
              onClick={handleRefuse}
              className="p-2 text-sm flex items-center gap-2 px-3.5 rounded-lg border border-red-300 bg-red-500 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  <p className="mt-1">กำลังดำเนินการ...</p>
                </>
              ) : (
                "ยืนยันการปฏิเสธ"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default RefuseBtn;
