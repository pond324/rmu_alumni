import Modal from "@/components/modal";
import { SelectFaculty } from "@/components/select-fac-dep";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { Loader2, PlusCircle, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const CreateEditDepartments = ({ department_id, setDep, fetch }) => {
  const [showModal, setShowModal] = useState(false);
  const [facultyId, setFacultyId] = useState("");

  const {
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm({
    defaultValues: {
      department_id: "",
      department_name: "",
    },
  });

  useEffect(() => {
    if (!department_id?.department_id) return;
    setShowModal(!!department_id?.department_id);
    setFacultyId(department_id?.faculty?.faculty_id);
    reset({
      ...department_id,
    });
  }, [department_id]);

  const handleClose = () => {
    setDep(null);
    setShowModal(false);
    reset({ department_id: "", department_name: "" });
    setFacultyId(null);
  };

  const [load, setLoad] = useState(false);
  const handleSave = async (data) => {
    if (!facultyId) return alerts.warning("กรุณาเลือกคณะ");
    try {
      setLoad(true);
      const api = department_id
        ? `/president/edit-department/${department_id?.department_id}`
        : "/president/create-department";
      const res = await axios.post(
        apiConfig.rmuAPI + api,
        { faculty_id: facultyId, ...data },
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
          department_id: "",
          department_name: "",
        });
        if (department_id?.department_id) handleClose();
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
        <p>เพิ่มสาขาวิชาใหม่</p>
      </button>
      <Modal isOpen={showModal} onClose={handleClose}>
        <div className="w-full lg:w-1/3 p-5 rounded-lg z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between">
            {" "}
            <span className="flex flex-col gap-0.5">
              <p className="font-semibold">
                {department_id?.department_id ? "แก้ไข" : "เพิ่ม"}ข้อมูลคณะ
              </p>
              <p className="text-sm text-gray-700">
                {" "}
                {department_id?.department_id
                  ? "แก้ไขรหัสสาขาวิชาและชื่อสาขาวิชา"
                  : "เพิ่มข้อมูลสาขาวิชาใหม่"}
              </p>
            </span>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <p className="mt-5 mb-1.5 text-sm">
            เลือกคณะ <small className="text-red-500">*</small>
          </p>
          <SelectFaculty
            width="w-full"
            facultyId={facultyId}
            setFacultyId={setFacultyId}
            // loadData={}
            setDepartmentId={() => {}}
            setFaculty={() => {}}
          />

          <p className="mt-5 text-sm">
            รหัสสาขาวิชา <small className="text-red-500">*</small>
          </p>
          <Controller
            name="department_id"
            control={control}
            rules={{ required: "กรุณากรอกรหัสสาขาวิชา" }}
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
          {errors.department_id && (
            <small className="text-red-500 mt-1">
              {errors.department_id?.message}
            </small>
          )}
          <p className="mt-5 text-sm">
            ชื่อสาขาวิชา <small className="text-red-500">*</small>
          </p>
          <Controller
            name="department_name"
            control={control}
            rules={{ required: "กรุณากรอกชื่อสาขาวิชา" }}
            render={({ field }) => (
              <input
                {...field}
                value={field.value || ""}
                type="text"
                placeholder="เช่น เทคโนโลยีสารสนเทศ"
                className="mt-1.5 focus:border-blue-500 w-full p-2 px-3 rounded-lg border border-gray-300 shadow-sm text-sm"
              />
            )}
          />
          {errors.department_name && (
            <small className="text-red-500 mt-1">
              {errors.department_name.message}
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

export default CreateEditDepartments;
