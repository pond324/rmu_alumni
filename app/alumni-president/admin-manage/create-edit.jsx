import { NO_PROFILE_IMG } from "@/app/users/profile/alumni-profile";
import Modal from "@/components/modal";
import Select from "@/components/select";
import { isValidEmail, isValidThaiPhoneNumber } from "@/libs/validate";
import {
  Check,
  Edit,
  Loader2,
  Trash2,
  UserCog,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import setProfileImage from "../message/page";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import LoadingWithProgess from "@/components/loading-wite-progress";

const PREFIX_OPTIONS = [
  { label: "นาย", value: 1 },
  { label: "นาง", value: 2 },
  { label: "นางสาว", value: 3 },
];

const CreateEdit = ({ admin, fetch }) => {
  const [showModal, setShowModal] = useState(false);
  const [fileProfile, setFileProfile] = useState(null);
  const [previewProfile, setPreviewProfile] = useState(NO_PROFILE_IMG);
  const [oldProfile, setOldProfile] = useState(admin?.profile);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      prefix: "",
      fname: "",
      lname: "",
      email: "",
      tel: "",
    },
  });

  const handleSelectImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileProfile(file);
    setPreviewProfile(URL.createObjectURL(file));
  };

  const handleDeleteImg = () => {
    setFileProfile(null);
    setPreviewProfile(NO_PROFILE_IMG);
  };

  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const handleSaveAdmin = async (data) => {
    const { isConfirmed } = await alerts.confirmDialog(
      "ยืนยันบันทึกข้อมูล",
      "คุณต้องการบันทึกข้อมูลผู้ดูแลรายนี้หรือไม่?",
      "บันทึก",
    );
    if (!isConfirmed) return;
    setSaving(true);
    try {
      const { prefix, ...rest } = data;
      const formData = new FormData();
      formData.append("prefix", prefix);
      for (const key of Object.keys(rest)) {
        formData.append(key, rest[key]);
      }
      if (fileProfile) {
        formData.append("profile", fileProfile);
      }
      if (fileProfile && oldProfile !== previewProfile) {
        formData.append("profileChange", true);
      }
      setProgress(0);
      const api = admin?.admin_id
        ? `/edit-admin/${admin?.admin_id}`
        : `/new-admin`;
      const res = await axios.post(
        apiConfig.rmuAPI + `/president${api}`,
        formData,
        {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );

              setProgress(percent);
              // console.log("🚀 ~ importToDb ~ percent:", percent)
            }
          },
        },
      );
      if (res.data.err) {
        return alerts.warning(res.data?.err);
      }
      if (res.status === 200) {
        alerts.success("บันทึกข้อมูลสำเร็จ");
        fetch();
        reset();
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!admin?.admin_id) return;
    reset({
      ...admin,
    });
    setPreviewProfile(
      admin?.profile ? apiConfig.imgAPI + admin?.profile : NO_PROFILE_IMG,
    );
    setOldProfile(
      admin?.profile ? apiConfig.imgAPI + admin?.profile : NO_PROFILE_IMG,
    );
  }, [admin]);

  return (
    <>
      {admin?.admin_id ? (
        <button
          onClick={() => setShowModal(true)}
          className="p-2 px-3 rounded-lg flex items-center gap-2 text-sm hover:bg-linear-90 hover:from-blue-600 hover:to-sky-300 hover:text-white"
        >
          <Edit size={18} />
          <p>แก้ไขข้อมูล</p>
        </button>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="p-2 px-3 text-sm hover:bg-blue-500 hover:text-white rounded-lg flex items-center gap-2 shadow-sm bg-gray-50"
        >
          <UserPlus size={18} />
          <p>เพิ่มผู้ดูแลใหม่</p>
        </button>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="w-full lg:w-1/3 md:w-2/3 p-5 rounded-lg z-50 bg-white flex flex-col">
          <div className="w-full flex items-start justify-between">
            <span className="flex flex-col">
              <p className="font-semibold text-lg">
                {!admin?.admin_id
                  ? "เพิ่มผู้ดูแลรายใหม่"
                  : "แก้ไขข้อมูลผู้ดูแล"}
              </p>
              <p className="text-sm text-gray-700">
                {admin?.admin_id
                  ? `แก้ไขข้อมูลผู้ดูแล - ${admin?.prefix || ""}${admin?.fname} ${admin?.lname}`
                  : "กรอกข้อมูลเพื่อเชิญผู้ดูแลใหม่เข้าสู่ระบบ"}
              </p>
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <div className="mt-3.5 h-[400px] overflow-auto w-full grid grid-cols-2 text-sm gap-5 gap-y-3">
            <span className="flex flex-col gap-1.5 mb-2.5 col-span-2 items-center">
              <p className="w-full">
                รูปภาพ <small>(ไม่บังคับ)</small>
              </p>
              <label
                htmlFor="img-picker"
                className="cursor-pointer hover:brightness-85 transition-all w-full flex flex-col items-center"
              >
                <input
                  accept="image/*"
                  type="file"
                  id="img-picker"
                  className="hidden"
                  onChange={handleSelectImg}
                />
                <div className="w-30 rounded-full h-30 shadow-md overflow-hidden">
                  <img
                    src={previewProfile}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              </label>
              {previewProfile && previewProfile !== NO_PROFILE_IMG && (
                <button
                  onClick={handleDeleteImg}
                  className="p-1.5 px-2 mt-1.5 rounded-lg text-sm bg-red-500 text-white flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  <p>ลบ</p>
                </button>
              )}
            </span>
            <span className="flex flex-col gap-1.5">
              <p className="">
                คำนำหน้า <small className="text-red-500">*</small>
              </p>
              <Controller
                name="prefix"
                rules={{ required: "กรุณาระบุคำนำหน้า" }}
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="เลือกคำนำหน้า"
                    {...field}
                    onChange={(option) => {
                      setValue("prefix", option?.label);
                    }}
                    options={PREFIX_OPTIONS}
                    value={PREFIX_OPTIONS.find(
                      (p) => p.label == watch("prefix") || null,
                    )}
                  />
                )}
              />
              {errors.prefix && (
                <small className="mt-1 text-red-500">
                  {errors.prefix.message}
                </small>
              )}
            </span>
            <span className="flex flex-col gap-1.5">
              <p className="">
                ชื่อจริง <small className="text-red-500">*</small>
              </p>
              <Controller
                name="fname"
                rules={{ required: "กรุณาระบุชื่อจริง" }}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    placeholder="ชื่อจริง"
                    className="w-full p-2 px-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500"
                  />
                )}
              />
              {errors.fname && (
                <small className="mt-1 text-red-500">
                  {errors.fname.message}
                </small>
              )}
            </span>
            <span className="flex flex-col gap-1.5">
              <p className="">
                นามสกุล <small className="text-red-500">*</small>
              </p>
              <Controller
                name="lname"
                rules={{ required: "กรุณาระบุนามสกุล" }}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    placeholder="นามสกุล"
                    className="w-full p-2 px-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500"
                  />
                )}
              />
              {errors.lname && (
                <small className="mt-1 text-red-500">
                  {errors.lname.message}
                </small>
              )}
            </span>
            <span className="flex flex-col gap-1.5">
              <p className="">
                อีเมล <small className="text-red-500">*</small>
              </p>
              <Controller
                name="email"
                rules={{
                  required: "กรุณาระบุอีเมล",
                  validate: (value) => {
                    if (!isValidEmail(value)) return "รูปแบบอีเมลไม่ถูกต้อง";
                  },
                }}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    placeholder="ระบุอีเมลที่ติดต่อได้"
                    className="w-full p-2 px-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500"
                  />
                )}
              />
              {errors.email && (
                <small className="mt-1 text-red-500">
                  {errors.email.message}
                </small>
              )}
            </span>
            <span className="flex flex-col gap-1.5">
              <p className="">
                เบอร์โทรศัพท์ <small className="text-red-500">*</small>
              </p>
              <Controller
                name="tel"
                rules={{
                  required: "กรุณาระบุเบอร์โทรศัพท์",
                  validate: (value) => {
                    if (!isValidThaiPhoneNumber(value))
                      return "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง";
                  },
                }}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    placeholder="ระบุเบอร์โทรศัพท์ที่ติดต่อได้"
                    className="w-full p-2 px-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500"
                  />
                )}
              />
              {errors.tel && (
                <small className="mt-1 text-red-500">
                  {errors.tel.message}
                </small>
              )}
            </span>
          </div>
          {!admin?.admin_id && (
            <p className="mt-2.5 text-sm text-gray-700">
              หมายเหตุ:ระบบจะส่ง รหัสผู้ใช้งาน และ รหัสผ่าน
              ของผู้ดูแลรายนี้ไปยังอีเมล
              โปรดตรวจสอบความถูกของอีเมลก่อนทำการบันทึก
            </p>
          )}
          <div className="w-full mt-5 border-t text-sm border-gray-300 pt-3.5 flex items-center justify-end gap-2.5">
            <button
              onClick={() => setShowModal(false)}
              className="p-2 px-3 rounded-lg border border-gray-300 shadow-sm"
            >
              ยกเลิก
            </button>
            <button
              disabled={saving}
              onClick={handleSubmit(handleSaveAdmin)}
              className="p-2 hover:bg-blue-600 px-3 rounded-lg shadow-sm bg-blue-500 text-white flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" />
                  <p>กำลังบันทึก...</p>
                </>
              ) : (
                <>
                  {" "}
                  <UserCog size={18} />
                  <p>บันทึก</p>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
      <LoadingWithProgess
        afterLoad={"กำลังโหลดข้อมูลใหม่..."}
        isOpen={saving}
        loadingText={"กำลังดำเนินการ..."}
        percent={progress}
      />
    </>
  );
};
export default CreateEdit;
