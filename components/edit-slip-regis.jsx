import { useState } from "react";
import Modal from "./modal";
import {
  AlertCircle,
  Check,
  CheckCircle,
  ImageIcon,
  Loader2,
  Phone,
  QrCode,
  ShieldCheck,
  ShieldUser,
  X,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { set } from "lodash";
import { useFacultyDep } from "@/hook/useFacultyDep";
import { departmentText, facultyText } from "./faculty-p";
import { isValidThaiPhoneNumber } from "@/libs/validate";

const EditSlipRegis = ({ alumni }) => {
  // console.log("🚀 ~ EditSlipRegis ~ alumni:", alumni)
  const { departments, faculties } = useFacultyDep();
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      alumni_id: "",
      otp: "",
      tel: "",
    },
  });

  const [slipFile, setSlipFile] = useState(null);
  const [previewSlip, setPreviewSlip] = useState("");
  const handleSlipChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alerts.warning("ขนาดไฟล์ต้องไม่เกิน 5MB");
        return;
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alerts.warning("รองรับเฉพาะไฟล์ JPG และ PNG เท่านั้น");
        return;
      }
      setSlipFile(file);
      setPreviewSlip(URL.createObjectURL(file));
    }
  };

  const [load, setLoad] = useState(false);
  const [isOTPSend, setIsOtpSend] = useState(true);
  const getOTP = async () => {
    setLoad(true);
    if (
      alumni?.regis_alumni?.isApproved === "accept" ||
      !alumni?.regis_alumni?.isApproved
    )
      return alerts.warning("ไม่สามารถดำเนินการได้");
    try {
      const res = await axios.post(
        apiConfig.rmuAPI + "/alumni/regis-otp-edit",
        {
          alumni_id: alumni?.alumni_id,
        },
      );
      if (res.data.err) {
        return alerts.warning(res.data.err);
      }
      if (res.status === 200) {
        setIsOtpSend(true);
        alerts.success(
          "ระบบได้ส่งรหัสยืนยันตัวตนไปยังอีเมลแล้ว! โปรดตรวจสอบอีเมลเพื่อรับรหัสยืนยันตัวตน",
        );
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };

  const [regisAlumniData, setRegisAlumniData] = useState(null);
  const checkOTP = async () => {
    setLoad(true);
    try {
      const res = await axios.post(
        apiConfig.rmuAPI + "/alumni/edit-regis-otp-check",
        { otp: watch("otp"), alumni_id: alumni?.alumni_id },
      );
      if (res.data.err) {
        return alerts.warning(res.data.err);
      }
      if (res.status === 200) {
        setRegisAlumniData(res.data.regisData || null);
        setValue("tel", res.data.regisData?.tel || "");
        setPreviewSlip(apiConfig.imgAPI + res.data.regisData?.slip_payment_url);
        alerts.success("รหัสยืนยันตัวตนถูกต้อง");
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };

  const uploadSlip = async () => {
    if (!slipFile) {
      return alerts.warning("กรุณาอัปโหลดหลักฐานการชำระใหม่ ก่อนดำเนินการต่อ");
    }
    const { isConfirmed } = await alerts.confirmDialog(
      "ยืนยันการส่งหลักฐานการชำระเงินใหม่",
      "คุณแน่ใจหรือไม่ว่าต้องการส่งหลักฐานการชำระเงินนี้แทนที่หลักฐานการชำระเดิม? กรุณาตรวจสอบให้แน่ใจว่าหลักฐานถูกต้องก่อนยืนยัน",
    );
    if (!isConfirmed) return;
    setLoad(true);
    try {
      const formData = new FormData();
      formData.append("regisDataId", regisAlumniData?.id);
      formData.append("alumni_id", alumni?.alumni_id);
      formData.append("slip", slipFile);
      formData.append("tel", watch("tel"));

      const res = await axios.put(
        apiConfig.rmuAPI + "/alumni/regis-edit-slip",
        formData,
      );
      if (res.data?.err) {
        return alerts.err(res.data.err);
      }
      if (res.status === 200) {
        alerts.success(
          "บันทึกหลักฐานการชำระเงินสำเร็จ! ระบบจะทำการตรวจสอบและแจ้งผลผ่านทางอีเมลภายใน 1-2 วันทำการ",
        );
        setShowModal(true);
        setStep(1);
        reset();
        setIsOtpSend(false);
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
        onClick={() => {
          setShowModal(true);
          setStep(1);
          reset();
          setIsOtpSend(false);
        }}
        type="button"
        className="lg:w-fit mt-2 lg:mt-0 rounded-lg w-full text-center lg:text-start py-2.5 lg:p-1.5 text-xs bg-gray-100 lg:rounded-full hover:bg-gray-300"
      >
        แก้ไขหลักฐานการชำระ
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div
          className={`z-50 bg-white relative w-full lg:w-1/3 p-5 flex flex-col items-center rounded-lg ${step === 2 && "h-[600px] overflow-auto"}`}
        >
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 p-2 rounded-lg hover:bg-gray-200 right-3"
          >
            <X />
          </button>
          {step === 1 ? (
            <>
              <p className="p-2.5 rounded-full bg-blue-100 text-blue-600">
                <ShieldCheck size={30} />
              </p>
              <p className="mt-2 text-sm text-gray-600 w-full break-words text-center">
                เพื่อความปลอดภัย กรุณายืนยันว่าคุณเป็นเจ้าของคำขอลงทะเบียนนี้
                ก่อนเข้าสู่ขั้นตอนแก้ไขหลักฐานการชำระเงิน
              </p>

              <div className="w-full text-sm mt-3.5 rounded-lg bg-gray-50 border border-gray-300 shadow-sm p-2 flex flex-col">
                <p className="font-semibold">
                  {alumni?.prefix || ""}
                  {alumni?.fname || ""} {alumni?.lname || ""}
                </p>
                <p className="text-sm text-gray-700">
                  {facultyText(faculties, alumni?.facultyId)}
                </p>
                <p className="text-sm text-gray-700">
                  {departmentText(departments, alumni?.departmentId)}
                </p>
              </div>
              {errors.alumni_id && (
                <div className="mt-3.5 w-full flex items-start gap-2.5 text-sm text-red-500 bg-red-100 rounded-lg p-2.5">
                  <AlertCircle size={18} />
                  <p className="w-full break-words">
                    {errors.alumni_id.message}
                  </p>
                </div>
              )}
              {errors.otp && (
                <div className="mt-3.5 w-full flex items-start gap-2.5 text-sm text-red-500 bg-red-100 rounded-lg p-2.5">
                  <AlertCircle size={18} />
                  <p className="w-full break-words">{errors.otp.message}</p>
                </div>
              )}

              <p className="mt-5 w-full text-sm">รหัสนักศึกษา</p>
              <Controller
                name="alumni_id"
                rules={{
                  required: "กรุณากรอกรหัสนักศึกษา",
                  validate: (value) => {
                    if (value !== alumni?.alumni_id)
                      return "ข้อมูลยืนยันตัวตนไม่ถูกต้อง กรุณาตรวจสอบรหัสนักศึกษาของคุณ";
                  },
                }}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    disabled={isOTPSend}
                    value={field.value || ""}
                    placeholder="กรอกรหัสนักศึกษาเพื่อรับรหัสยืนยันตัวตน"
                    className={`w-full text-sm p-2 px-2.5 mt-1.5 rounded-lg border border-gray-300 focus:border-blue-500 shadow-sm ${isOTPSend && "bg-gray-100 cursor-not-allowed"}`}
                  />
                )}
              />
              {isOTPSend && (
                <>
                  <p className="mt-5 w-full text-sm">รหัสยืนยันตัวตนจากอีเมล</p>
                  <Controller
                    name="otp"
                    rules={{
                      required: "กรุณากรอกรหัสยืนยัน",
                    }}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        value={field.value || ""}
                        placeholder="กรอกรหัสยืนยันตัวตน"
                        className={`w-full text-sm p-2 px-2.5 mt-1.5 rounded-lg border border-gray-300 focus:border-blue-500 shadow-sm`}
                      />
                    )}
                  />
                  <p className="mt-1.5 w-full text-sm text-gray-600">
                    ตรวจสอบรหัสยืนยันตัวตนได้ที่อีเมล {alumni?.alumni_id}
                    @rmu.ac.th
                  </p>
                </>
              )}
            </>
          ) : (
            <>
              {" "}
              <div className="w-full flex flex-col mt-3 items-center pt-5 border-t border-gray-300">
                <p>รายละเอียดการชำระค่าลงทะเบียน</p>
                <div className="w-full text-sm mt-3 rounded-lg bg-gray-50 border border-gray-300 shadow-sm p-2 flex flex-col">
                  <p className="font-semibold">
                    {alumni?.prefix || ""}
                    {alumni?.fname || ""} {alumni?.lname || ""}
                  </p>
                  <p className="text-sm text-gray-700">
                    {facultyText(faculties, alumni?.facultyId)}
                  </p>
                  <p className="text-sm text-gray-700">
                    {departmentText(departments, alumni?.departmentId)}
                  </p>
                </div>
                <span className="mt-2.5 p-1 flex items-center gap-2 px-2 text-xs rounded-full bg-blue-100 text-blue-600">
                  <QrCode size={16} />
                  <p>สแกน QR เพื่อชำระเงิน</p>
                </span>

                <div className="p-1 rounded-lg md:w-1/2 w-2/3 h-auto border border-gray-300 shadow-xs mt-3">
                  <img
                    src="https://media.istockphoto.com/id/1347277567/vector/qr-code-sample-for-smartphone-scanning-on-white-background.jpg?s=612x612&w=0&k=20&c=PYhWHZ7bMECGZ1fZzi_-is0rp4ZQ7abxbdH_fm8SP7Q="
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600">ยอดชำระ</p>
                <p className="text-2xl font-bold text-blue-600">500 บาท</p>

                {errors.tel && (
                  <div className="mt-3.5 w-full flex items-start gap-2.5 text-sm text-red-500 bg-red-100 rounded-lg p-2.5">
                    <AlertCircle size={18} />
                    <p className="w-full break-words">{errors.tel.message}</p>
                  </div>
                )}
                <div className="w-full flex flex-col">
                  <span className="flex items-center gap-2 mt-5">
                    <Phone size={20} className="text-blue-600" />
                    <p className="text-sm">
                      เบอร์โทรศัพท์ที่ติดต่อได้{" "}
                      <small className="text-red-500">*</small>
                    </p>
                  </span>

                  <Controller
                    control={control}
                    name="tel"
                    rules={{
                      required: "กรุณากรอกเบอร์โทรศัพท์",
                      validate: (value) => {
                        if (!isValidThaiPhoneNumber(value)) {
                          return "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง";
                        }
                      },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          setValue("tel", e.target.value);
                        }}
                        placeholder="กรณีที่เจ้าหน้าที่ต้องติดต่อเพื่อยืนยันข้อมูลการชำระเงิน"
                        type="tel"
                        className={`mt-2 text-sm rounded-lg w-full p-2 px-2.5 border border-gray-300 shadow-xs focus:border-blue-500 ${errors.tel ? "border-red-500" : "border-gray-300"}`}
                      />
                    )}
                  />

                  {errors.tel && (
                    <small className="w-full text-xs text-red-500 mt-2">
                      {errors.tel.message}
                    </small>
                  )}
                  <p className="text-sm mt-5">หลักฐานการชำระเงิน</p>
                  <label
                    htmlFor="slip-upload"
                    className={`mt-2 relative transition-all duration-300 hover:bg-blue-50 cursor-pointer hover:border-blue-500 w-full ${!slipFile ? "py-6" : "h-auto"} rounded-lg border-dashed border-2 flex flex-col items-center border-gray-300`}
                  >
                    {previewSlip && (
                      <button
                        type="button"
                        className="absolute top-2 right-2 text-white bg-red-500 p-1 rounded-lg hover:bg-red-600 shadow-sm"
                        onClick={() => {
                          setSlipFile(null);
                          setPreviewSlip("");
                        }}
                      >
                        <X size={18} />
                      </button>
                    )}
                    {previewSlip ? (
                      <img
                        src={previewSlip}
                        alt="Slip Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <>
                        {" "}
                        <input
                          type="file"
                          id="slip-upload"
                          className="hidden"
                          onChange={handleSlipChange}
                        />
                        <ImageIcon className="text-gray-600" size={32} />
                        <p className="text-sm mt-2">คลิกเพื่อเลือกรูปภาพ</p>
                        <p className="text-xs text-gray-500 mt-1.5">
                          รองรับไฟล์ JPG, PNG (ขนาดไม่เกิน 5MB)
                        </p>
                      </>
                    )}
                  </label>
                  {slipFile && (
                    <p className="mt-2 text-xs text-red-500">
                      *โปรดตรวจสอบหลักฐานการชำระเงินก่อนส่ง
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          <button
            disabled={load || !alumni?.alumni_id}
            onClick={handleSubmit(
              step === 1 ? (isOTPSend ? checkOTP : getOTP) : uploadSlip,
            )}
            className={`mt-5 text-sm justify-center ${load && "flex-col"} text-center w-full rounded-lg bg-linear-90 from-blue-600 to-sky-300 p-2.5 flex text-white items-center gap-2`}
          >
            {load ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <p className="text-sm">
                  กำลังดำเนินการ... อาจใช้เวลานาน หรือลองใหม่อีกครั้งหลังจาก 2-3
                  นาที
                </p>
              </>
            ) : step === 1 ? (
              !isOTPSend ? (
                <>
                  {" "}
                  <ShieldUser size={18} />
                  <p>ขอรหัสยืนยันตัวตน</p>
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  <p>ตรวจสอบรหัสยืนยันตัวตน</p>
                </>
              )
            ) : (
              step === 2 && (
                <>
                  <QrCode size={18} />
                  <p>ส่งหลักฐานการชำระใหม่</p>
                </>
              )
            )}
          </button>
        </div>
      </Modal>
    </>
  );
};
export default EditSlipRegis;
