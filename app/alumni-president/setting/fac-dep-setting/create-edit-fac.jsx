import Modal from "@/components/modal";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { Loader2, PlusCircle, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const CreateEdit = ({ faculty_id, setFac, fetch }) => {
  const [showModal, setShowModal] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm({
    defaultValues: {
      faculty_id: "",
      faculty_name: "",
    },
  });

  useEffect(() => {
    if (!faculty_id?.faculty_id) return;
    setShowModal(!!faculty_id?.faculty_id);

    reset({
      ...faculty_id,
    });
  }, [faculty_id]);

  const handleClose = () => {
    setFac(null);
    setShowModal(false);
  };

  const [load, setLoad] = useState(false);
  const handleSave = async (data) => {
    try {
      setLoad(true);
      const api = faculty_id
        ? `/president/edit-faculty/${faculty_id?.faculty_id}`
        : "/president/create-faculty";
      const res = await axios.post(apiConfig.rmuAPI + api, data, {
        withCredentials: true,
      });
      if (res.data?.err) {
        return alerts.warning(res?.data?.err);
      }
      if (res.status === 200) {
        alerts.success("บันทึกข้อมูลแล้ว");
        fetch();
        reset({
          faculty_id: "",
          faculty_name: "",
        });
        if (faculty_id?.faculty_id) {
          handleClose();
        }
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
        className="p-2 px-3 rounded-lg flex items-center text-sm gap-2 shadow-sm bg-blue-500 text-white"
      >
        <PlusCircle size={18} />
        <p>เพิ่มคณะใหม่</p>
      </button>
      <Modal isOpen={showModal} onClose={handleClose}>
        <div className="w-full lg:w-1/3 p-5 rounded-lg z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between">
            {" "}
            <span className="flex flex-col gap-0.5">
              <p className="font-semibold">
                {faculty_id?.faculty_id ? "แก้ไข" : "เพิ่ม"}ข้อมูลคณะ
              </p>
              <p className="text-sm text-gray-700">
                {" "}
                {faculty_id?.faculty_id
                  ? "แก้ไขรหัสคณะและชื่อคณะ"
                  : "เพิ่มข้อมูลคณะใหม่"}
              </p>
            </span>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <p className="mt-5 text-sm">
            รหัสคณะ <small className="text-red-500">*</small>
          </p>
          <Controller
            name="faculty_id"
            control={control}
            rules={{ required: "กรุณากรอกรหัสคณะ" }}
            render={({ field }) => (
              <input
                {...field}
                value={field.value || ""}
                type="text"
                placeholder="เช่น 10"
                className="mt-1.5 focus:border-blue-500 w-full p-2 px-3 rounded-lg border border-gray-300 shadow-sm text-sm"
              />
            )}
          />
          {errors.faculty_id && (
            <small className="text-red-500 mt-1">
              {errors.faculty_id.message}
            </small>
          )}
          <p className="mt-5 text-sm">
            ชื่อคณะ <small className="text-red-500">*</small>
          </p>
          <Controller
            name="faculty_name"
            control={control}
            rules={{ required: "กรุณากรอกชื่อคณะ" }}
            render={({ field }) => (
              <input
                {...field}
                value={field.value || ""}
                type="text"
                placeholder="เช่น คณะเทคโนโลยีสารสนเทศ"
                className="mt-1.5 focus:border-blue-500 w-full p-2 px-3 rounded-lg border border-gray-300 shadow-sm text-sm"
              />
            )}
          />
          {errors.faculty_name && (
            <small className="text-red-500 mt-1">
              {errors.faculty_name.message}
            </small>
          )}

          <div className="mt-5 pt-5 border-t border-gray-300 w-full flex justify-end">
            <button
              disabled={load}
              onClick={handleSubmit(handleSave)}
              className="p-2 px-3 rounded-lg flex items-center text-sm gap-2 shadow-sm bg-blue-500 text-white"
            >
              {load ? (
                <>
                  <Loader2 className="animate-spin" />
                  <p>กำลังบันทึก...</p>
                </>
              ) : (
                <>
                  {" "}
                  <Save size={18} />
                  <p>บันทึก</p>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default CreateEdit;
