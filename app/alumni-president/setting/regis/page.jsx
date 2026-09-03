"use client";
import { Check, Loader2, QrCode, Trash2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import RegisSettingSkeleton from "@/components/setting-regis-skeleton";
import { Controller, useForm } from "react-hook-form";
import Select from "@/components/select";
import { generateQrcode } from "@/libs/generate-qrcode";

const paymentMethods = [
  { label: "PromptPay(พร้อมเพย์)", value: "PromptPay(พร้อมเพย์)" },
  { label: "ไทยพาณิชย์ (SCB)", value: "ไทยพาณิชย์ (SCB)" },
  { label: "กสิกรไทย (KBANK)", value: "กสิกรไทย (KBANK)" },
  { label: "กรุงไทย (KTB)", value: "กรุงไทย (KTB)" },
  { label: "กรุงเทพ (BBL)", value: "กรุงเทพ (BBL)" },
  { label: "กรุงศรี (BAY)", value: "กรุงศรี (BAY)" },
];

const SettingRegis = () => {
  const [id, setId] = useState();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [generating, setGenerating] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const droppedFile = acceptedFiles[0];
    if (!droppedFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(droppedFile.type)) {
      alerts.warning("อนุญาตเฉพาะไฟล์รูปภาพ (JPG, PNG, WEBP, GIF)");
      return;
    }

    setPreview(URL.createObjectURL(droppedFile));
    setFile(droppedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleDelete = () => {
    setFile(null);
    setPreview("");
  };

  const [load, setLoad] = useState(true);
  const getData = async () => {
    setLoad(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-setting-data",
        { withCredentials: true },
      );
      if (res.status === 200 && res.data) {
        setId(res.data.id);
        if (res.data.regis_payment_qrcode) {
          setPreview(apiConfig.imgAPI + res.data.regis_payment_qrcode);
        } else {
          setPreview("");
        }
        setFile(null);
        reset({
          regis_payment: res.data.regis_payment ?? "",
          regis_payment_account_name: res.data.regis_payment_account_name ?? "",
          regis_payment_account_number:
            res.data.regis_payment_account_number ?? "",
          regis_payment_account_back:
            res.data.regis_payment_account_back ?? "",
        });
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

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      regis_payment: "",
      regis_payment_account_name: "",
      regis_payment_account_number: "",
      regis_payment_account_back: "",
    },
  });

  const [uploading, setUploading] = useState(false);
  const handleSaveRegisPaymentQRcode = async (data) => {
    if (!file && !preview) {
      return alerts.warning("กรุณาอัปโหลดรูปภาพหรือสร้างคิวอาร์โค้ด");
    }
    setUploading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      if (file) {
        formData.append("file", file);
      }
      const targetId = id || "default";
      const res = await axios.post(
        apiConfig.rmuAPI + `/president/setting-edit-qrcode-payment/${targetId}`,
        formData,
        {
          withCredentials: true,
        },
      );
      if (res.status === 200) {
        alerts.success("บันทึกสำเร็จ");
        getData();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateQrCode = async () => {
    const accountNumber = watch("regis_payment_account_number");
    const amount = Number(watch("regis_payment"));
    if (!accountNumber) {
      return alerts.warning("กรุณาระบุเลขพร้อมเพย์");
    }
    setGenerating(true);
    try {
      const generatedFile = await generateQrcode(accountNumber, amount);
      if (generatedFile) {
        setPreview(URL.createObjectURL(generatedFile));
        setFile(generatedFile);
        alerts.success("สร้างคิวอาร์โค้ดแล้ว");
      }
    } catch (error) {
      console.error(error);
      alerts.err("ไม่สามารถสร้างคิวอาร์โค้ดได้");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      {load ? (
        <RegisSettingSkeleton />
      ) : (
        <>
          <div className="w-full mt-5 shadow-sm rounded-lg bg-white">
            <div className="w-full p-3.5 rounded-tl-lg rounded-tr-lg border border-gray-200 flex flex-col">
              <span className="flex items-center gap-3.5">
                <p className="p-2.5 rounded-lg bg-blue-100 text-blue-600 w-fit">
                  <QrCode />
                </p>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold">คิวอาร์โค้ด</p>
                  <p className="text-xs text-gray-700">
                    ตั้งค่าคิวอาร์โค้ดสำหรับรับชำระค่าลงทะเบียนศิษย์เก่า
                  </p>
                </div>
              </span>
            </div>
            <div className="w-full flex-col lg:flex-row border border-gray-200 border-t-0 flex gap-8 p-5">
              <div className="w-full lg:w-1/4 flex flex-col items-center">
                <div
                  {...getRootProps()}
                  className={`
    w-full h-75
    rounded-lg border-2 overflow-hidden border-dashed
    flex flex-col items-center justify-center gap-1.5
    cursor-pointer
    transition-all duration-300 ease-in-out
    border-gray-300 bg-gray-50
    hover:border-blue-300 hover:bg-blue-50
    ${isDragActive ? "bg-blue-50 border-blue-500 scale-105" : ""}
  `}
                >
                  <input {...getInputProps()} className="hidden" />
                  {preview ? (
                    <img
                      className="w-full h-full object-contain p-2"
                      src={preview}
                      alt="QR Code"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <QrCode size={50} className="text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700">
                        คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวาง
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        รองรับไฟล์ .jpg, .jpeg, .png, .webp, .gif
                      </p>
                    </div>
                  )}
                </div>

                {watch("regis_payment_account_back") ===
                  "PromptPay(พร้อมเพย์)" &&
                  Number(watch("regis_payment")) > 0 &&
                  watch("regis_payment_account_number") && (
                    <button
                      type="button"
                      disabled={generating}
                      onClick={handleGenerateQrCode}
                      className="w-full p-2.5 text-sm shadow-sm rounded-lg flex items-center gap-2 justify-center bg-gray-50 hover:text-white hover:bg-gradient-to-r from-blue-600 to-sky-400 mt-2 transition-colors cursor-pointer"
                    >
                      {generating ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <QrCode size={18} />
                      )}
                      <p>สร้างคิวอาร์โค้ดอัตโนมัติ</p>
                    </button>
                  )}
                <div className="w-full mt-1.5 flex items-center justify-center">
                  {(file || preview) && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="p-2 px-3 text-sm rounded-lg flex items-center gap-2 shadow-sm text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <Trash2 size={18} />
                      <p>ลบรูปภาพ</p>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-full lg:w-1/2">
                <p className="text-sm">ชื่อบัญชีผู้รับเงิน</p>
                <Controller
                  name="regis_payment_account_name"
                  rules={{ required: "กรุณาระบุชื่อบัญชีผู้รับเงิน" }}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      value={field.value || ""}
                      {...field}
                      className="w-full md:w-1/2 lg:w-2/3 focus:border-blue-500 p-2 px-3 rounded-lg text-sm border border-gray-300 mt-1.5 shadow-sm outline-none"
                      placeholder="เช่น สมาคมศิษย์เก่ามหาวิทยาลัยราชภัฏมหาสารคาม"
                    />
                  )}
                />
                {errors?.regis_payment_account_name && (
                  <small className="mt-1 text-red-500">
                    {errors.regis_payment_account_name.message}
                  </small>
                )}
                <p className="text-sm mt-2.5">เลขพร้อมเพย์ / เลขบัญชี</p>
                <Controller
                  name="regis_payment_account_number"
                  rules={{ required: "กรุณาระบุเลขพร้อมเพย์ / เลขบัญชี" }}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      value={field.value || ""}
                      {...field}
                      className="w-full md:w-1/2 lg:w-2/3 focus:border-blue-500 p-2 px-3 rounded-lg text-sm border border-gray-300 mt-1.5 shadow-sm outline-none"
                      placeholder="เช่น 0-1234-56789-01-2"
                    />
                  )}
                />
                {errors?.regis_payment_account_number && (
                  <small className="mt-1 text-red-500">
                    {errors.regis_payment_account_number.message}
                  </small>
                )}
                <p className="text-sm mt-2.5">ยอดชำระ</p>
                <Controller
                  name="regis_payment"
                  rules={{ required: "กรุณาระบุยอดชำระ" }}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      value={field.value || ""}
                      {...field}
                      className="w-full md:w-1/2 lg:w-2/3 focus:border-blue-500 p-2 px-3 rounded-lg text-sm border border-gray-300 mt-1.5 shadow-sm outline-none"
                      placeholder="เช่น 1000"
                    />
                  )}
                />
                {errors?.regis_payment && (
                  <small className="mt-1 text-red-500">
                    {errors.regis_payment.message}
                  </small>
                )}
                <p className="text-sm mt-2.5">ธนาคาร</p>
                <Controller
                  name="regis_payment_account_back"
                  rules={{ required: "กรุณาระบุธนาคาร" }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      className="mt-1.5"
                      options={paymentMethods}
                      placeholder="เลือกบัญชีธนาคาร"
                      value={
                        paymentMethods.find((p) => p.value === field.value) ||
                        null
                      }
                      onChange={(option) => {
                        setValue(
                          "regis_payment_account_back",
                          option?.value || "",
                          { shouldValidate: true },
                        );
                      }}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: "100%",
                          maxWidth: "410px",
                          minHeight: "40px",
                          borderRadius: "8px",
                          border: state.isFocused
                            ? "1px solid #3B82F6"
                            : "1px solid #D1D5DB",
                          boxShadow: "none",
                          backgroundColor: "#fff",
                          paddingLeft: "4px",
                          "&:hover": {
                            borderColor: "#93C5FD",
                          },
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: "0 6px",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "#9CA3AF",
                          fontSize: "14px",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#111827",
                          fontSize: "14px",
                        }),
                        indicatorSeparator: () => ({
                          display: "none",
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          color: "#9CA3AF",
                          paddingRight: "12px",
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: "8px",
                          overflow: "hidden",
                          zIndex: 9999,
                        }),
                      }}
                    />
                  )}
                />
                {errors?.regis_payment_account_back && (
                  <small className="mt-1 text-red-500">
                    {errors.regis_payment_account_back.message}
                  </small>
                )}
              </div>
            </div>
            <div className="w-full flex items-center p-5 rounded-bl-lg rounded-br-lg border border-gray-200 justify-end border-t-0">
              <button
                type="button"
                disabled={uploading}
                onClick={handleSubmit(handleSaveRegisPaymentQRcode)}
                className="p-2 px-3 text-sm rounded-lg flex items-center gap-2 shadow-sm bg-blue-500 hover:bg-blue-600 text-white cursor-pointer transition-colors"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <p>กำลังบันทึก...</p>
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    <p>บันทึก</p>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default SettingRegis;
