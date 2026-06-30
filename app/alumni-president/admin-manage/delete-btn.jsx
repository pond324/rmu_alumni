import Modal from "@/components/modal";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";

const DeleteBtn = ({ admin, fetch }) => {
  const [showModal, setShowModal] = useState(false);

  const [reason, setReason] = useState("");
  const [load, setLoad] = useState(false);
  const handleDelete = async () => {
    if (!reason) return alerts.warning("โปรดระบุเเหตุผล");
    const { isConfirmed } = await alerts.confirmDialog(
      "ยืนยันการลบ",
      "คุณต้องการลบบัญชีผู้ดูแลรายนี้หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้",
      "ลบ",
    );
    if (!isConfirmed) return;

    setLoad(true);
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI + `/president/delete-admin/${admin?.admin_id}`,
        { withCredentials: true, params: { reason } },
      );
      if (res.status === 200) {
        alerts.success("ลบบัญชีผู้ดูแล!");
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
      <button
        onClick={() => setShowModal(true)}
        className="hover:bg-red-500 text-red-500 hover:text-white p-2 px-3 rounded-lg flex items-center gap-2 text-sm"
      >
        <Trash2 size={18} />
        <p>ลบผู้ดูแล</p>
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="w-full lg:w-1/3 rounded-lg flex flex-col p-5 bg-white z-50">
          <div className="w-full flex items-start justify-between">
            <span className="flex flex-col">
              <p className="text-lg font-semibold">ลบข้อมูลผู้ดูแล</p>
              <p className="text-sm text-gray-700">
                ยืนยันลบข้อมูลผู้ดูแลและระบุเหตุผลที่ต้องลบบัญชีผู้ดูแลนี้
              </p>
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <p className="mt-5 text-sm">ระบุเหตุผล</p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1.5 w-full p-2 px-3 h-28 outline-none focus:border-gray-500 rounded-lg border border-gray-300 shadow-sm"
            placeholder="ระบุเเหตุผลที่ต้องดำเนินการในครั้งนี้..."
          ></textarea>
          <p className="mt-3.5 text-sm text-gray-600">
            หมายเหตุ: ระบบจะส่งเหตุผลในการดำเนินการไปยังอีเมลของผู้ดูแลรายนี้
          </p>

          <div className="mt-3.5 pt-3.5 border-t border-gray-300 w-full flex items-center gap-2 justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="p-2 px-3 rounded-lg text-sm shadow-sm border border-gray-300"
            >
              ยกเลิก
            </button>
            <button
              disabled={load}
              onClick={handleDelete}
              className="p-2 bg-red-500 text-white px-3 rounded-lg text-sm flex items-center gap-2 shadow-sm"
            >
              {load ? (
                <>
                  <Loader2 className="animate-spin" />
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
export default DeleteBtn;
