import Modal from "@/components/modal";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";

const DeleteBtn = ({ model, tile, des }) => {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);
  const handleDelete = async () => {
    if (!password) return alerts.warning("กรุณากรอกรหัสผ่านเพื่อยืนยันการลบ");
    const { isConfirmed } = await alerts.confirmDialog(
      `ยืนยันลบข้อมูล${tile}`,
      `${des}จะถูกลบทั้งหมดและการกระทำนี้จะไม่สามารถย้อนกลับได้!`,
      "ยืนยันลบ",
    );
    if (!isConfirmed) return;
    setLoad(true);
    try {
      const res = await axios.post(
        apiConfig.rmuAPI + `/president/delete-data/`,{model,password},
        {
          withCredentials: true,
        },
      );
      if (res.data.err) {
        return alerts.warning(res.data.err);
      }
      if (res.status === 200) {
        alerts.success("ลบข้อมูลแล้ว");
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
        className="p-2 px-3 rounded-lg mt-1.5 text-xs hover:text-white text-red-500 hover:bg-red-600 border border-red-300 flex items-center gap-2"
      >
        <Trash2 size={18} />
        <p>ล้างข้อมูล</p>
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="w-full lg:w-1/3 bg-white z-50 p-5 rounded-lg flex flex-col">
          <div className="w-full  flex items-start justify-between">
            <div className="flex flex-col">
              <span className="flex items-center gap-2">
                <Trash2 className="text-red-500" />
                <p className="font-semibold text-[1rem]">ลบ{tile}</p>
              </span>
              <p className="text-sm text-gray-700 mt-0.5">ยืนยันลบ{des}</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <div className="mt-3.5 w-full flex flex-col pt-3.5 border-t border-gray-300">
            <p>กรอกรหัสผ่านบัญชีของคุณ</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านที่คุณใช้เข้าสู่ระบบ"
              className="mt-2 w-full rounded-lg text-sm p-2 px-2.5 border border-gray-300 shadow-sm focus:border-blue-500"
            />

            <p className="mt-3.5 text-sm text-red-500">
              *{tile}จะถูกลบทั้งหมด และการกระทำนี้จะไม่สามารถย้อนกลับได้
            </p>
          </div>
          <div className="mt-3.5 w-full pt-3.5 border-t border-gray-300 flex items-center justify-end gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="p-2 px-3 rounded-lg text-sm border border-gray-300 shadow-xs"
            >
              ยกเลิก
            </button>
            <button
              disabled={load}
              onClick={handleDelete}
              className="p-2 px-3 bg-red-500 text-white flex items-center gap-2 rounded-lg text-sm border border-red-300 shadow-xs"
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
                  <p>ยืนยันลบข้อมูล</p>
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
