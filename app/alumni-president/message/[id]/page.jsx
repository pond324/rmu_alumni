"use client";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Send,
  Text,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Select from "@/components/select";
import SearchReciever from "./search-reciever";
import ViewSelectAlumni from "./view-select-alumni";
import { alerts } from "@/libs/alerts";
import LoadingWithProgess from "@/components/loading-wite-progress";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { useParams, useRouter } from "next/navigation";
const TextEditor = dynamic(() => import("@/components/text-editor-v2"), {
  ssr: false, // ❌ ปิด SSR
});

const SENDMAIL_CATE = [
  { label: "กิจกรรม", value: "กิจกรรม" },
  { label: "ข่าวสาร", value: "ข่าวสาร" },
  { label: "ทุนการศึกษา", value: "ทุนการศึกษา" },
  { label: "ประกาศ", value: "ประกาศ" },
  { label: "แบบสำรวจ", value: "แบบสำรวจ" },
  { label: "ขอบคุณ", value: "ขอบคุณ" },
  { label: "เชิญ", value: "เชิญ" },
  { label: "อื่นๆ", value: "อื่นๆ" },
];

const NewEditEmail = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [editorKey, setEditorKey] = useState(0);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      detail: "",
    },
  });
  const [selectCategory, setSelectCategory] = useState([]);
  const handleSelectCategory = (cate) => {
    setSelectCategory((prev) => (prev.includes(cate) ? prev : [...prev, cate]));
  };
  const handleDeleteCategory = (cate) => {
    setSelectCategory((prev) => prev.filter((p) => p !== cate));
  };

  const [selectAlumniId, setSelectAlumniId] = useState([]);
  const handleDeleteSelectAlumniId = (alumni) => {
    setSelectAlumniId((prev) => prev.filter((p) => p !== alumni));
  };

  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const handleSend = async (data) => {
    if (selectCategory.length < 1)
      return alerts.warning("กรุณาเลือกอย่างน้อย 1 หมวดหมู่");
    if (selectAlumniId.length < 1)
      return alerts.warning("กรุณาเลือกศิษย์เก่าผู้รับอย่างน้อย 1 คน");
    const { isConfirmed } = await alerts.confirmDialog(
      "ยืนยันการส่งข้อความ",
      `คุณต้องการส่งข้อความถึงศิษย์เก่า จำนวน ${selectAlumniId?.length} คน?`,
    );
    if (!isConfirmed) return;
    setSending(true);
    try {
      const payload = {
        ...data,
        selectCategory,
        selectAlumniId: selectAlumniId,
      };
      const res = await axios.post(
        apiConfig.rmuAPI + `/president/sendemail`,
        payload,
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
      if (res.status === 200) {
        alerts.success("ส่งข้อความสำเร็จ");
        router.push("/alumni-president/message");
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setSending(false);
    }
  };

  const [load, setLoad] = useState(true);
  const getDataRepeat = async () => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + `/president/get-sendtext/${id}`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        const { title, detail, alumniId, category } = res.data;
        console.log("🚀 ~ getDataRepeat ~ alumniId:", alumniId)
        reset({
          title,
          detail,
        });
        setSelectAlumniId(
          alumniId?.split(",")?.length < 1
            ? [alumniId]
            : alumniId?.split(","),
        );
        setSelectCategory(
          category?.split(",")?.length || 0 < 1
            ? [category]
            : category?.split(","),
        );
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    if (!id || id == 0) return;
    getDataRepeat();
  }, [id]);

  return (
    <>
      <div className="p-5 bg-gray-50 flex flex-col w-full items-center">
        <div className="w-full lg:w-1/2 flex flex-col">
          <Link
            href={"/alumni-president/message"}
            className="flex items-center w-fit gap-2 text-sm bg-white shadow-sm hover:bg-gray-100 transition-all p-2 px-3.5 rounded-lg"
          >
            <ArrowLeft size={18} />
            <p>ย้อนกลับ</p>
          </Link>

          <div className="flex flex-col gap-0.5 mt-5">
            <span className="flex items-center gap-2">
              <Mail size={30} className="text-blue-500" />
              <p className="text-lg font-semibold">ส่งอีเมลถึงศิษย์เก่า</p>
            </span>
            <p className="text-sm text-gray-700">
              เขียนข้อความและเลือกผู้รับที่ต้องการส่ง
            </p>
          </div>
          <div className="mt-5 w-full rounded-lg overflow-hidden text-sm shadow-sm border border-gray-300">
            <div className="w-full flex-col lg:flex-row gap-2 bg-linear-90 border-b border-gray-300 from-blue-50 p-5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Text className="text-blue-500" />
                <p className="">{params?.id ? "แก้ไขข้อความ" : "เขียนข้อความใหม่"}</p>
              </span>
              {/* <span className="flex items-center gap-2">
                <p className="text-gray-700">ส่งในนาม:</p>
                <p className="">นายปฐมพร วงสุวรรณ (อธิการบดี)</p>
              </span> */}
            </div>
            <div className="w-full p-5 bg-white flex flex-col h-[1000px]">
              <p className="text-gray-700">
                หัวข้ออีเมล <small className="text-red-500">*</small>
              </p>
              <Controller
                name="title"
                rules={{ required: "กรุณากรอกหัวข้ออีเมล" }}
                control={control}
                render={({ field }) => (
                  <input
                    value={field.value || ""}
                    {...field}
                    placeholder="เช่น ขอเรียนเชิญร่วมงานคืนสู่เหย้า"
                    type="text"
                    className="w-full mt-1.5 p-2 px-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500"
                  />
                )}
              />
              {errors.title && (
                <small className="text-red-500 mt-1">
                  {errors.title.message}
                </small>
              )}
              <p className="text-gray-700 mt-5 mb-2">
                หมวดหมู่ <small className="text-red-500">*</small>
              </p>
              <Select
                options={SENDMAIL_CATE}
                placeholder="เลือกหมวดหมู่ (เลือกได้หลายรายการ)"
                onChange={(option) => handleSelectCategory(option?.value)}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                เลือกแล้ว {selectCategory.length} รายการ
              </p>
              {selectCategory.length > 0 && (
                <div className="w-full flex items-center gap-2.5 flex-wrap mt-1.5">
                  {selectCategory.map((c, index) => (
                    <span
                      key={index}
                      className="flex items-center cursor-pointer gap-1.5 p-1 px-2.5 rounded-full text-xs  font-semibold bg-blue-50 shadow-sm"
                    >
                      <p key={index} className="text-blue-500">
                        {c}
                      </p>
                      <button
                        onClick={() => handleDeleteCategory(c)}
                        className="p-0.5 rounded-lg text-blue-500 hover:shadow-sm hover:text-red-500 hover:bg-white"
                      >
                        <X size={16} className="hover:text-red-500" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-gray-700 mt-5 mb-2">
                เนื้อหาอีเมล <small className="text-red-500">*</small>
              </p>
              <Controller
                name="detail"
                rules={{ required: "กรุณาเขียนข้อความที่ต้องการส่ง" }}
                control={control}
                render={({ field }) => (
                  <TextEditor
                    key={`detail-${editorKey}`}
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.detail && (
                <small className="text-red-500 mt-1">
                  {errors.detail.message}
                </small>
              )}

              <span className="flex text-gray-700 mt-7 items-center gap-2">
                <Users size={16} />
                <p>
                  เลือกผู้รับ <small className="text-red-500">*</small>
                </p>
              </span>
              <SearchReciever
                selectAlumniId={selectAlumniId}
                setSelectAlumniId={setSelectAlumniId}
              />
              <ViewSelectAlumni
                handleDeleteAlumni={handleDeleteSelectAlumniId}
                selectAlumniId={selectAlumniId}
              />
            </div>
            <div className="p-5 w-full rounded-bl-lg rounded-br-lg flex items-center border border-gray-300 justify-end gap-2.5 bg-white">
              <Link
                href={"/alumni-president/message"}
                className="p-2 px-3 rounded-lg border border-gray-300"
              >
                ยกเลิก
              </Link>
              <button
                disabled={sending}
                onClick={handleSubmit(handleSend)}
                className="p-2 px-3 hover:bg-blue-600 rounded-lg shadow-sm bg-blue-500 text-white flex items-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <p>กำลังส่ง...</p>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <p>ส่งข้อความ</p>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <LoadingWithProgess
        isOpen={sending}
        loadingText={"กำลังส่งข้อความ อาจใช้เวลานาน"}
        percent={progress}
      />
    </>
  );
};
export default NewEditEmail;
