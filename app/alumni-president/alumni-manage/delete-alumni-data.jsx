import Modal from "@/components/modal";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { AlertCircle, Loader2, Trash2, User, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const DeleteAlumniData = ({ alumni_id, fetch }) => {
  const [showModal, setShowModal] = useState(false);
  const [toggleDeleteType, setToggleDeleteType] = useState(1); // 0 = nonoe choose 1 = account only 2 = delete all

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      reason: "",
      password: "",
    },
  });

  const [load, setLoad] = useState(false);
  const handleDelete = async () => {
    if (toggleDeleteType === 0)
      return alerts.warning("โปรดเลือกรูปแบบการดำเนินการ");
    const { isConfirmed } = await alerts.confirmDialog(
      "ยืนยันการลบ?",
      "*การกระทำนี้จะไม่สามารถย้อนกลับได้!",
      "ลบ",
    );
    if (!isConfirmed) return;
    setLoad(true);
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI + `/president/delete-alumni-data/${alumni_id}`,
        {
          withCredentials: true,
          params: {
            toggleDeleteType,
            reason: watch("reason"),
            password: watch("password"),
          },
        },
      );
      if (res.data.err) {
        return alerts.warning(res.data.err);
      }
      if (res.status === 200) {
        alerts.success("ดำเนินการลบสำเร็จ");
        setToggleDeleteType(0);
        reset();
        setShowModal(false);
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
        className="p-2 px-3 hover:bg-red-500 hover:text-white rounded-lg flex items-center gap-2"
      >
        <Trash2 size={18} />
        <p>ลบบัญชี</p>
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="z-50 p-5 rounded-lg bg-white flex flex-col w-full lg:w-1/2">
          <div className="w-full flex items-start justify-between pb-3.5 border-b border-gray-300">
            <div className="flex flex-col">
              <span className="flex items-center gap-2">
                <Trash2 className="text-red-500" />
                <p className="font-semibold text-lg">ลบข้อมูลบัญชีศิษย์เก่า</p>
              </span>
              <p className="text-sm text-gray-700">
                ยืนยันตัวตนผู้ดำเนินการลบข้อมูลศิษย์เก่า
              </p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          {/* <p className="mt-3.5 text-sm text-gray-700">
            โปรดเลือกรูปแบบการดำเนินการ
          </p>
          <div className="w-full flex items-center gap-2 mt-2.5 ">
            <button
              onClick={() => setToggleDeleteType(1)}
              className={`flex-1 p-2.5 ${toggleDeleteType == 1 ? "bg-red-500 text-white" : "hover:bg-red-100 bg-red-50"} shadow-sm rounded-lg flex items-center gap-2 justify-center`}
            >
              <User />
              <p>ลบเฉพาะบัญชีนี้</p>
            </button>
            <button
              onClick={() => setToggleDeleteType(2)}
              className={`flex-1 p-2.5 ${toggleDeleteType == 2 ? "bg-red-500 text-white" : "hover:bg-red-100 bg-red-50"} shadow-sm rounded-lg flex items-center gap-2 justify-center`}
            >
              <AlertCircle />
              <p>ลบบัญชี้และข้อมูลทุกอย่างที่เกี่ยวข้องกับบัญชีนี้</p>
            </button>
          </div>
          {toggleDeleteType !== 0 && (
            <p className="text-sm text-gray-700 mt-3 w-full text-center">
              *!
              {toggleDeleteType == 1
                ? "ข้อมูลบัญชีนี้จะถูกลบแต่ข้อมูลอื่นๆที่เกี่ยวข้องกับบัญชีดังกล่าวจะอยู่คงเดิม"
                : "ข้อมูลบัญนี้จะถูกลบรวมไปถึงข้อมูลที่เกี่ยวข้องกับบัญชีนี้ ได้แก่ ช่องทางการติดต่อ ที่อยู่ ประวัติการทำงาน ประวัติการศึกษาต่อและการตั้งค่าความเป็นส่วนตัวจะถูกลบ"}
            </p>
          )} */}
          <p className="mt-3.5 text-sm">ระบุเหตุผล</p>
          <Controller
            name="reason"
            control={control}
            rules={{ required: "กรุณาระบุเหตุผล" }}
            render={({ field }) => (
              <textarea
                value={field?.value || ""}
                {...field}
                placeholder="ระบุเหตุผลที่ดำเนินการครั้งนี้..."
                className="mt-1.5 w-full text-sm p-2 px-3 focus:border-gray-800 resize-none rounded-lg border border-gray-300 outline-none shadwo-sm h-[110px]"
              ></textarea>
            )}
          />
          {errors.reason && (
            <small className="mt-1 text-red-500">{errors.reason.message}</small>
          )}
          <p className="mt-3.5 text-sm">กรอกรหัสผ่าน</p>
          <Controller
            name="password"
            control={control}
            rules={{
              required:
                "กรุณากรอกรหัสผ่าน เราจำเป็นต้องยืนยันให้แน่ใจว่าคุณกำลังดำเนินการ",
            }}
            render={({ field }) => (
              <input
                value={field.value || ""}
                {...field}
                type="password"
                placeholder="ระบุรหัสผ่านที่คุณใช้เข้าสู่ระบบ"
                className="mt-1.5 w-full p-2 px-3 rounded-lg text-sm border border-gray-300 shadow-sm focus:border-gray-700"
              />
            )}
          />
          {errors.password && (
            <small className="mt-1 text-red-500">
              {errors.password.message}
            </small>
          )}

          <p className="mt-3.5 text-sm">
            *การกระทำดังกล่าวไม่สามารถย้อนกลับได้
            หลังจากดำเนินการแล้วระบบจะแจ้งเตือนไปยังอีเมลของศิษย์เก่า
          </p>
          <div className="w-full mt-5 pt-3.5 border-t border-gray-300 flex items-center justify-end gap-2">
            <button className="p-2 px-3 rounded-lg text-sm shadow-sm border border-gray-300">
              ยกเลิก
            </button>
            <button
              disabled={load}
              onClick={handleSubmit(handleDelete)}
              className="flex bg-red-500 text-white items-center gap-2 rounded-lg p-2 px-3 shadow-xs"
            >
              {load ? (
                <>
                  <Loader2 className="animate-spin" />
                  <p>กำลังโหลด...</p>
                </>
              ) : (
                <>
                  {" "}
                  <AlertCircle size={18} />
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
export default DeleteAlumniData;
