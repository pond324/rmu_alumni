"use client";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { Book, Building2, Check, FileSpreadsheet, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const FacDepSetting = () => {
  const [uploading, setUploading] = useState(false);
  const [settingData, setSettingData] = useState(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fac_sheet_link: "",
      dep_sheet_link: "",
    },
  });

  const [id, setId] = useState("");
  const [load, setLoad] = useState(true);
  const getData = async () => {
    setLoad(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-setting-data",
        { withCredentials: true },
      );
      if (res.status === 200) {
        setId(res?.data?.id);
        reset({
          fac_sheet_link: res?.data?.fac_sheet_link,
          dep_sheet_link: res?.data?.dep_sheet_link,
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

  const handleSave = async (data) => {
    setUploading(true);
    try {
      const res = await axios.put(
        apiConfig.rmuAPI + `/president/edit-fac-dep-sheet/${id}`,
        data,
        { withCredentials: true },
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

  return (
    <>
      {load ? (
        <div className="w-full mt-5 shadow-sm rounded-lg bg-white animate-pulse">
          {/* Header */}
          <div className="w-full p-3.5 border border-gray-200 rounded-t-lg">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-gray-200" />

              <div className="flex flex-col gap-2">
                <div className="h-4 w-72 bg-gray-200 rounded" />
                <div className="h-3 w-96 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full border border-gray-200 border-t-0 rounded-b-lg p-5">
            {/* Guide Box */}
            <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
              <div className="h-4 w-28 bg-gray-200 rounded mb-3" />

              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-11/12 bg-gray-200 rounded" />
                <div className="h-3 w-10/12 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Faculty URL */}
            <div className="flex items-center gap-2 mt-4">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="h-4 w-40 bg-gray-200 rounded" />
            </div>

            <div className="mt-2 h-11 w-full md:w-1/2 bg-gray-200 rounded-lg" />

            {/* Major URL */}
            <div className="flex items-center gap-2 mt-5">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="h-4 w-36 bg-gray-200 rounded" />
            </div>

            <div className="mt-2 h-11 w-full md:w-1/2 bg-gray-200 rounded-lg" />

            {/* Button */}
            <div className="mt-5">
              <div className="h-10 w-28 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full mt-5 shadow-sm rounded-lg bg-white">
          <div className="w-full p-3.5 rounded-tl-lg rounded-tr-lg border border-gray-200 flex flex-col">
            <span className="flex items-center gap-3.5">
              <p className="p-2.5 rounded-lg bg-blue-100 text-blue-600 w-fit">
                <FileSpreadsheet />
              </p>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold">
                  แหล่งข้อมูลคณะและสาขา (Google Sheets)
                </p>
                <p className="text-xs text-gray-700">
                  ระบบจะดึงรายการคณะและสาขาจากไฟล์ Google Sheets ที่เผยแพร่เป็น
                  CSV โดยไม่ต้องจัดการในฐานข้อมูล
                </p>
              </div>
            </span>
          </div>

          <div className="w-full rounded-bl-lg rounded-br-lg border border-gray-200 border-t-0 flex flex-col p-5">
            <div className="p-2.5 bg-gray-50 border rounded-lg border-gray-300 flex flex-col text-sm">
              <p>วิธีการตั้งค่า</p>
              <p className="text-xs text-gray-700 my-0.5">
                1. เปิด Google Sheets แล้วเลือก File → Share → Publish to web
              </p>
              <p className="text-xs text-gray-700 my-0.5">
                2. เลือกชีตที่ต้องการและรูปแบบ Comma-separated values (.csv)
              </p>
              <p className="text-xs text-gray-700 my-0.5">
                3. คัดลอกลิงก์ที่ได้ (ลงท้ายด้วย output=csv) มาวางด้านล่าง
              </p>
            </div>
            <span className="flex items-center gap-2 text-sm mt-3.5">
              <Building2 size={18} />
              <p>ลิงก์ CSV รายการคณะ</p>
            </span>
            <Controller
              name="fac_sheet_link"
              control={control}
              rules={{ required: "กรุณาใส่ลิงค์รายการคณะ" }}
              render={({ field }) => (
                <input
                  type="text"
                  value={field.value || ""}
                  {...field}
                  // value={regisPayment}
                  // onChange={(e) => setRegisPayment(e.target.value)}
                  className="w-full focus:border-blue-500 p-2 px-3 rounded-lg text-sm border border-gray-300 mt-1.5 shadow-sm"
                  placeholder="เช่น https://docs.google.com/spreadsheets..."
                />
              )}
            />
            {errors.fac_sheet_link && (
              <small className="mt-1 text-red-500">
                {errors.fac_sheet_link.message}
              </small>
            )}

            <span className="flex items-center gap-2 text-sm mt-5">
              <Book size={18} />
              <p>ลิงก์ CSV รายการสาขา</p>
            </span>
            <Controller
              name="dep_sheet_link"
              control={control}
              rules={{ required: "กรุณาใส่ลิงค์รายการสาขา" }}
              render={({ field }) => (
                <input
                  type="text"
                  value={field.value || ""}
                  {...field}
                  // value={regisPayment}
                  // onChange={(e) => setRegisPayment(e.target.value)}
                  className="w-full focus:border-blue-500 p-2 px-3 rounded-lg text-sm border border-gray-300 mt-1.5 shadow-sm"
                  placeholder="เช่น https://docs.google.com/spreadsheets..."
                />
              )}
            />
            {errors.dep_sheet_link && (
              <small className="mt-1 text-red-500">
                {errors.dep_sheet_link.message}
              </small>
            )}
            <div className="mt-2 flex items-center gap-2">
              <button
                //   disabled={uploading}
                onClick={handleSubmit(handleSave)}
                className="w-fit mt-3 text-sm text-blue-500 p-2 px-3 rounded-lg flex items-center gap-2 hover:text-white shadow-sm hover:bg-blue-500"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <p>กำลังบันทึก...</p>
                  </>
                ) : (
                  <>
                    {" "}
                    <Check size={18} />
                    <p>บันทึก</p>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default FacDepSetting;
