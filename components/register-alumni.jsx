"use client";

import { useEffect, useState } from "react";
import logo from "@/assets/images/logo_rmu.png";
import Modal from "./modal";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  CheckCircle,
  Clock,
  Download,
  Eye,
  EyeClosed,
  GraduationCap,
  Image as ImageIcon,
  Phone,
  QrCode,
  RectangleEllipsis,
  Upload,
  User,
  X,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import Loading from "./loading";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import PasswordRules from "./password-rules";
import { isValidThaiPhoneNumber } from "@/libs/validate";
import { departmentText, facultyText } from "./faculty-p";
import { useFacultyDep } from "@/hook/useFacultyDep";
import { useRouter } from "next/navigation";

const RegisterAlumni = () => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { departments, faculties } = useFacultyDep();
  const [authSuccess, setAuthSuccess] = useState(false);
  const [sendToEmail, setSendToEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [alumniId, setAlumniId] = useState("");
  const [alumniData, setAlumniData] = useState(null);

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      alumni_id: "",
      otp: "",
      newPass: "",
      confirmPass: "",
      tel: "",
    },
  });

  const checkOTP = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(apiConfig.rmuAPI + "/auth/regis-check-otp", {
        alumni_id: alumniId,
        ...data,
      });
      if (res.data?.err) {
        return alerts.warning(res.data.err);
      }
      if (res.status === 200) {
        alerts.success("รหัสยืนยันตัวตนถูกต้อง!");
        setStep(3);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setIsLoading(false);
    }
  };

  const checkAlumni = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        apiConfig.rmuAPI + "/auth/regis-check-user",
        { alumni_id: alumniId, ...data },
      );
      if (res.data?.err) {
        return alerts.err(res.data.err);
      }
      if (res.status === 200) {
        setAuthSuccess(true);
        setSendToEmail(res.data.email);
        alerts.success(
          "ระบบได้ส่งรหัสยืนยันตัวตนไปยังอีเมลเรียบร้อยแล้ว กรุณาตรวจสอบและกรอกรหัสยืนยันตัวตนเพื่อดำเนินการต่อไป",
        );
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setIsLoading(false);
    }
  };

  const regisAlumni = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(apiConfig.rmuAPI + "/auth/regis-alumni", {
        alumni_id: alumniId,
        ...data,
      });
      if (res.data?.err) {
        return alerts.err(res.data.err);
      }
      if (res.status === 200) {
        alerts.success("สร้างรหัสผ่านสำเร็จ!");
        setAlumniData(res.data?.alumni || {});
        setStep(5);
        setAuthSuccess(false);
        setSlipFile(null);
        reset();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setIsLoading(false);
    }
  };

  const [slipFile, setSlipFile] = useState(null);
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
    }
  };
  const uploadSlip = async () => {
    if (!slipFile) {
      return alerts.warning("กรุณาอัปโหลดหลักฐานการชำระเงินก่อนดำเนินการต่อ");
    }
    const { isConfirmed } = await alerts.confirmDialog(
      "ยืนยันการส่งหลักฐานการชำระเงิน",
      "คุณแน่ใจหรือไม่ว่าต้องการส่งหลักฐานการชำระเงินนี้? กรุณาตรวจสอบให้แน่ใจว่าหลักฐานถูกต้องก่อนยืนยัน",
    );
    if (!isConfirmed) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("alumni_id", alumniId);
      formData.append("slip", slipFile);
      formData.append("tel", watch("tel"));
      const res = await axios.post(
        apiConfig.rmuAPI + "/auth/regis-upload-slip",
        formData,
      );
      if (res.data?.err) {
        return alerts.err(res.data.err);
      }
      if (res.status === 200) {
        alerts.success(
          "อัปโหลดหลักฐานการชำระเงินสำเร็จ! ระบบจะทำการตรวจสอบและแจ้งผลผ่านทางอีเมลภายใน 1-2 วันทำการ",
        );
        setStep(4);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setIsLoading(false);
    }
  };
  const gotoLogin = () => setShowModal(false);

  const [regisData, setRegisData] = useState(null);
  const [load, setLoad] = useState(true);
  const getData = async () => {
    setLoad(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-setting-data",
      );
      if (res.status === 200) {
        setRegisData(res?.data);
        console.log("🚀 ~ getData ~ res?.data:", res?.data);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const handleDownloadQrCode = async () => {
    try {
      const imageUrl = apiConfig.imgAPI + regisData?.regis_payment_qrcode;

      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "promptpay-qrcode.png";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alerts.error("ดาวน์โหลด QR Code ไม่สำเร็จ");
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setShowModal(true);
          setStep(1);
        }}
        type="button"
        className="text-sm text-blue-800 hover:underline hover:text-blue-600"
      >
        ลงทะเบียนบัณฑิต
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div
          className={`z-50 ${step >= 3 && " h-[600px] overflow-auto"} relative w-full md:w-2/3 lg:w-1/3 bg-white p-6 rounded-lg flex flex-col items-center gap-2`}
        >
          <div className="flex absolute top-3.5 right-3.5 items-end w-full justify-end">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="p-2 rounded-md hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <Image
            alt="logo"
            priority
            src={logo}
            className="w-24 lg:w-1/5 h-auto"
          />

          <h1 className="font-bold text-3xl mt-2 text-blue-700">
            ลงทะเบียนบัณฑิต
          </h1>
          <p className="mt-1 text-sm md:text-[1rem] w-full text-center">
            ระบบสารสนเทศเครือข่ายศิษย์เก่า มหาวิทยาลัยราชภัฏมหาสารคาม
          </p>

          <div className="w-full flex  md:items-center mt-3 gap-2 text-center">
            <span className="flex items-center flex-col gap-1">
              <p
                className={`p-1.5 transition-all duration-150 rounded-full font-semibold border border-gray-300 ${step === 1 ? "bg-blue-500 text-white px-3.5" : step > 1 ? "bg-green-500 text-white px-1.5" : ""}`}
              >
                {step > 1 ? <Check /> : "1"}
              </p>
              <p className="text-xs text-gray-600">ตรวจสอบข้อมูล</p>
            </span>

            <span
              className={`flex-1 h-2 border-t-2  ${step > 1 && step < 5 ? "border-blue-500" : "border-gray-300"}`}
            ></span>
            <span className="flex items-center flex-col gap-1">
              <p
                className={`p-1.5 transition-all duration-150 rounded-full font-semibold border border-gray-300 ${step === 2 ? "bg-blue-500 text-white px-3.5" : step > 2 ? "bg-green-500 text-white px-1.5" : "px-3.5"}`}
              >
                {step > 2 ? <Check /> : "2"}
              </p>
              <p className="text-xs text-gray-600">ยืนยันตัวตน</p>
            </span>

            <span
              className={`flex-1 h-2 border-t-2  ${step > 2 && step < 5 ? "border-blue-500" : "border-gray-300"}`}
            ></span>
            <span className="flex items-center flex-col gap-1">
              <p
                className={`p-1.5 transition-all duration-150  rounded-full font-semibold border border-gray-300 ${step === 3 ? "bg-blue-500 text-white px-3.5" : step > 3 ? "bg-green-500 text-white px-1.5" : "px-3.5"}`}
              >
                {step > 3 ? <Check /> : "3"}
              </p>
              <p className="text-xs text-gray-600">ชำระค่าลงทะเบียน</p>
            </span>
            <span
              className={`flex-1 h-2 border-t-2  ${step > 3 && step < 5 ? "border-blue-500" : "border-gray-300"}`}
            ></span>
            <span className="flex items-center flex-col gap-1">
              <p
                className={`p-1.5 transition-all duration-150 rounded-full font-semibold border border-gray-300 ${step === 4 ? "bg-blue-500 text-white px-3.5" : step > 4 ? "bg-green-500 text-white px-1.5" : "px-3.5"}`}
              >
                {step > 4 ? <Check /> : "4"}
              </p>
              <p className="text-xs text-gray-600">สร้างรหัสผ่าน</p>
            </span>
            <span
              className={`flex-1 h-2 border-t-2  ${step > 4 ? "border-blue-500" : "border-gray-300"}`}
            ></span>
            <span className="flex items-center flex-col gap-1">
              <p
                className={`p-1.5 transition-all duration-150 rounded-full font-semibold border border-gray-300 ${step > 4 ? "bg-green-500 text-white px-1.5" : "px-3.5 "}`}
              >
                {step > 4 ? <Check /> : "5"}
              </p>
              <p className="text-xs text-gray-600">เสร็จสิ้น</p>
            </span>
          </div>

          {step === 1 ? (
            <>
              <p className="mt-5 w-full">รหัสนักศึกษา</p>
              <div
                className={`flex w-full items-center gap-3 py-3 border-b-2 ${
                  errors.alumni_id
                    ? "border-red-500"
                    : authSuccess
                      ? "border-gray-300 cursor-not-allowed"
                      : "border-blue-500"
                } `}
              >
                <User size={20} />
                <Controller
                  name="alumni_id"
                  control={control}
                  rules={{ required: "กรุณากรอกรหัสนักศึกษา" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        setAlumniId(e.target.value);
                        setValue("alumni_id", e.target.value);
                      }}
                      disabled={authSuccess}
                      className={`${authSuccess && "cursor-not-allowed"} w-[95%] text-[0.9rem]`}
                      placeholder="กรอกรหัสนักศึกษา"
                    />
                  )}
                />
              </div>
              <p className="mt-1 w-full text-sm text-gray-600">
                กรอกรหัสนักศึกษา 12 หลัก เพื่อรับรหัสยืนยันตัวตนทางอีเมล
              </p>
              {errors.alumni_id && (
                <small className="w-full text-xs text-red-500 mt-2">
                  {errors.alumni_id.message}
                </small>
              )}
            </>
          ) : step === 2 ? (
            <div className="mt-5 w-full flex flex-col gap-1.5">
              <span className="flex items-center gap-3">
                <label className="">รหัสยืนยันตัวตน</label>
              </span>

              <div
                className={`flex items-center gap-3 py-3 border-b-2 ${errors.otp ? "border-b-red-500" : "border-blue-500"} `}
              >
                <RectangleEllipsis size={18} />
                <Controller
                  name="otp"
                  control={control}
                  rules={{ required: "กรุณากรอกรหัสยืนยันตัวตน" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-[88%] text-[0.9rem]"
                      placeholder={`กรอกรหัสยืนยันที่ส่งไปยังอีเมล`}
                    />
                  )}
                />
              </div>
              <p className="mt-1 w-full text-sm text-gray-600">
                รหัสยืนยันตัวตนถูกส่งไปที่{" "}
                <span className="font-medium">{sendToEmail}</span>
              </p>
              {errors.otp && (
                <small className="w-full text-xs text-red-500 mt-2">
                  {errors.otp.message}
                </small>
              )}
            </div>
          ) : step === 3 ? (
            <div className="w-full flex flex-col mt-3 items-center pt-5 border-t border-gray-300">
              <p>ชำระค่าลงทะเบียน</p>
              <span className="mt-1.5 p-1 flex items-center gap-2 px-2 text-xs rounded-full bg-blue-100 text-blue-600">
                <QrCode size={16} />
                <p>สแกน QR เพื่อชำระเงิน</p>
              </span>

              <div className="p-1 rounded-lg md:w-1/2 w-2/3 h-52 border border-gray-300 shadow-xs mt-3">
                <img
                  src={apiConfig.imgAPI + regisData?.regis_payment_qrcode}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
              <button onClick={handleDownloadQrCode} className="mt-2 hover:bg-blue-100 p-2 px-3 rounded-lg text-xs flex items-center gap-2 bg-blue-50 text-blue-600 shadow-sm">
                <Download size={16} />
                <p>บันทึกคิวอาร์โค้ด</p>
              </button>

              <p className="text-sm mt-1.5 text-gray-700">
                ชื่อบัญชี: {regisData?.regis_payment_account_name}
              </p>
              <p className="text-sm mt-1.5 text-gray-700">
                เลขบัญชี: {regisData?.regis_payment_account_number} (
                {regisData?.regis_payment_account_back})
              </p>
              <p className="mt-2 text-sm text-gray-600">ยอดชำระ</p>
              <p className="text-2xl font-bold text-blue-600">
                {regisData?.regis_payment?.toLocaleString()} บาท
              </p>

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
                  {slipFile && (
                    <button
                      className="absolute top-2 right-2 text-white bg-red-500 p-1 rounded-lg hover:bg-red-600 shadow-sm"
                      onClick={() => setSlipFile(null)}
                    >
                      <X size={18} />
                    </button>
                  )}
                  {slipFile ? (
                    <img
                      src={URL.createObjectURL(slipFile)}
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
          ) : step === 5 ? (
            <div className="w-full flex flex-col mt-3 items-center pt-5 border-t border-gray-300">
              <p>ส่งคำขอลงทะเบียนแล้ว</p>
              <div className="mt-3 rounded-full p-5 bg-orange-100 shadow-xs">
                <CheckCircle size={35} className="text-amber-500" />
              </div>
              <p className="font-semibold mt-2.5">
                {alumniData?.prefix || ""}
                {alumniData?.fname || ""} {alumniData?.lname || ""}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                {facultyText(faculties, alumniData?.facultyId)}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {departmentText(departments, alumniData?.departmentId)}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                ปีการศึกษา(พ.ศ.): {alumniData?.year_start || "ไม่พบปีที่เข้า"} -{" "}
                {alumniData?.year_end || "ไม่พบปีที่จบ"}
              </p>
              <div className="mt-3.5 w-full p-3.5 rounded-lg bg-orange-100 text-sm flex flex-col">
                <span className="flex items-center gap-2">
                  <Clock size={18} className="text-orange-500" />
                  <p>รอผู้ดูแลตรวจสอบและอนุมัติ</p>
                </span>
                <p className="mt-1 w-full text-xs break-words text-gray-700">
                  คำขอลงทะเบียนพร้อมหลักฐานการชำระถูกส่งเรียบร้อยแล้ว
                  ผู้ดูแลระบบจะตรวจสอบและแจ้งผลผ่านอีเมลภายใน 1-2 วันทำการ
                </p>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-5 w-full">สร้างรหัสผ่าน</p>
              <div
                className={`flex w-full items-center gap-3 py-3 border-b-2 ${
                  errors.newPass ? "border-red-500" : "border-blue-500"
                } `}
              >
                {showPass ? (
                  <Eye
                    className="cursor-pointer"
                    size={20}
                    onClick={() => setShowPass(!showPass)}
                  />
                ) : (
                  <EyeClosed
                    className="cursor-pointer"
                    size={20}
                    onClick={() => setShowPass(!showPass)}
                  />
                )}

                <Controller
                  name="newPass"
                  control={control}
                  rules={{
                    required: "โปรดสร้างรหัสผ่านตามเงื่อนไขที่กำหนด",
                    validate: (value) => {
                      if (value.length < 8)
                        return "ความยาวต้องมากกว่า 8 ตัวอักษร";
                      if (!/[a-zA-Z]/.test(value))
                        return "ต้องมีตัวอักษรภาษาอังกฤษ";
                      if (!/[0-9]/.test(value)) return "ต้องมีตัวเลข";
                      if (!/[^a-zA-Z0-9]/.test(value))
                        return "ต้องมีอักขระพิเสษ";
                      if (
                        watch("confirmPass").length > 0 &&
                        value !== watch("confirmPass")
                      )
                        return "รหัสผ่านไม่ตรงกัน";
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        setAlumniId(e.target.value);
                        setValue("newPass", e.target.value);
                      }}
                      type={showPass ? "text" : "password"}
                      className={` w-[95%] text-[0.9rem]`}
                      placeholder="สร้างรหัสผ่านสำหรับเข้าสู่ระบบ"
                    />
                  )}
                />
              </div>
              {errors.newPass && (
                <small className="w-full text-xs text-red-500 mt-2">
                  {errors.newPass.message}
                </small>
              )}

              <PasswordRules password={watch("newPass")} />

              <p className="mt-5 w-full">ยืนยันรหัสผ่าน</p>
              <div
                className={`flex w-full items-center gap-3 py-3 border-b-2 ${
                  errors.confirmPass ? "border-red-500" : "border-blue-500"
                } `}
              >
                {showConfirmPass ? (
                  <Eye
                    size={20}
                    className="cursor-pointer"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  />
                ) : (
                  <EyeClosed
                    className="cursor-pointer"
                    size={20}
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  />
                )}

                <Controller
                  name="confirmPass"
                  control={control}
                  rules={{
                    required: "โปรดยืนยันรหัสผ่านของคุณ",
                    validate: (value) => {
                      if (value !== watch("confirmPass"))
                        return "รหัสผ่านไม่ตรงกัน";
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        setAlumniId(e.target.value);
                        setValue("confirmPass", e.target.value);
                      }}
                      type={showConfirmPass ? "text" : "password"}
                      className={` w-[95%] text-[0.9rem]`}
                      placeholder="กรอกรหัสผ่านอีกครั้งเพื่อยืนยัน"
                    />
                  )}
                />
              </div>
              {errors.confirmPass && (
                <small className="w-full text-xs text-red-500 mt-2">
                  {errors.confirmPass.message}
                </small>
              )}
            </>
          )}

          <button
            disabled={isLoading}
            type="button"
            onClick={handleSubmit(
              step === 2
                ? checkOTP
                : step === 1
                  ? checkAlumni
                  : step === 3
                    ? uploadSlip
                    : step === 5
                      ? gotoLogin
                      : regisAlumni,
            )}
            className={`mt-7 hover:bg-gradient-to-l w-full rounded-lg ${
              isLoading ? "flex-col flex" : "flex"
            } items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-blue-300 w-full text-white gap-3`}
          >
            {isLoading ? (
              <>
                <Loading type={1} />
                <p className="text-xs">
                  อาจใช้เวลานานโปรดรอสักครู่... หรือลองใหม่หลังจาก 2-3 นาที
                </p>
              </>
            ) : step === 1 ? (
              <>
                <ArrowRight size={22} color="white" />
                <p>ตรวจสอบข้อมูล</p>
              </>
            ) : step === 2 ? (
              <>
                <Check size={22} color="white" />
                <p>ยืนยันตัวตน</p>
              </>
            ) : step === 3 ? (
              <>
                <Upload size={22} color="white" />
                <p>ส่งหลักฐานการชำระ</p>
              </>
            ) : step === 4 ? (
              <>
                <GraduationCap size={22} color="white" />
                <p>ลงทะเบียน</p>
              </>
            ) : (
              <p>ปิดหน้าต่าง</p>
            )}
          </button>
        </div>
      </Modal>
    </>
  );
};
export default RegisterAlumni;
