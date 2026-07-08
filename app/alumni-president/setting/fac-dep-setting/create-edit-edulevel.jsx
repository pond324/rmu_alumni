import Modal from "@/components/modal";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { Loader2, PlusCircle, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const EduLevelCreateEdit = ({ edu_levelId, setEdu, fetch }) => {
  const [showModal, setShowModal] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm({
    defaultValues: {
      edu_levelId: "",
      edu_level_name: "",
    },
  });

  useEffect(() => {
    if (!edu_levelId?.edu_levelId) return;
    setShowModal(!!edu_levelId?.edu_levelId);
    reset({
      ...edu_levelId,
    });
  }, [edu_levelId]);

  const handleClose = () => {
    setEdu(null);
    setShowModal(false);
    reset({ edu_levelId: "", edu_level_name: "" });
  };

  const [load, setLoad] = useState(false);
  const handleSave = async (data) => {
    try {
      setLoad(true);
      const api = edu_levelId
        ? `/president/edit-edulevel/${edu_levelId?.edu_levelId}`
        : "/president/create-edulevel";
      const res = await axios.post(
        apiConfig.rmuAPI + api,
        { ...data },
        {
          withCredentials: true,
        },
      );
      if (res.data?.err) {
        return alerts.warning(res?.data?.err);
      }
      if (res.status === 200) {
        alerts.success("บันทึกข้อมูลแล้ว");
        fetch();
        reset({
          edu_levelId: "",
          department_name: "",
        });
        if (edu_levelId?.edu_levelId) handleClose();
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
        <p>เพิ่มระดับการศึกษาใหม่</p>
      </button>
      <Modal isOpen={showModal} onClose={handleClose}>
        <div className="w-full lg:w-1/3 p-5 rounded-lg z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between">
            {" "}
            <span className="flex flex-col gap-0.5">
              <p className="font-semibold">
                {edu_levelId?.edu_levelId ? "แก้ไข" : "เพิ่ม"}
                ข้อมูลระดับการศึกษา
              </p>
              <p className="text-sm text-gray-700">
                {" "}
                {edu_levelId?.edu_levelId
                  ? "แก้ไขรหัสระดับการศึกษาและชื่อระดับการศึกษา"
                  : "เพิ่มข้อมูลระดับการศึกษาใหม่"}
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
            รหัสระดับการศึกษา <small className="text-red-500">*</small>
          </p>
          <Controller
            name="edu_levelId"
            control={control}
            rules={{ required: "กรุณากรอกรหัสระดับการศึกษา" }}
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
          {errors.edu_levelId && (
            <small className="text-red-500 mt-1">
              {errors.edu_levelId?.message}
            </small>
          )}
          <p className="mt-5 text-sm">
            ชื่อรหัสระดับการศึกษา <small className="text-red-500">*</small>
          </p>
          <Controller
            name="edu_level_name"
            control={control}
            rules={{ required: "กรุณากรอกชื่อรหัสระดับการศึกษา" }}
            render={({ field }) => (
              <input
                {...field}
                value={field.value || ""}
                type="text"
                placeholder="เช่น ปริญญาตรี"
                className="mt-1.5 focus:border-blue-500 w-full p-2 px-3 rounded-lg border border-gray-300 shadow-sm text-sm"
              />
            )}
          />
          {errors.edu_level_name && (
            <small className="text-red-500 mt-1">
              {errors.edu_level_name.message}
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

export default EduLevelCreateEdit;
