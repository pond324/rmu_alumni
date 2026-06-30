import LoadingWithProgess from "@/components/loading-wite-progress";
import Modal from "@/components/modal";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import ExportExcel from "@/libs/export-excel";
import { DateTHFormat } from "@/libs/thai-local-formate-date";
import axios from "axios";
import { progress } from "framer-motion";
import { Download, File, Loader2, X } from "lucide-react";
import { useState } from "react";

const ADMIN_DATA_FILED = [
  { text: "ข้อมูลทั่วไป" },
  { text: " คำหน้า", filed: "prefix" },
  { text: " ชื่อ", filed: "fname" },
  { text: " นามสกุล", filed: "lname" },
  { text: " วันที่เพิ่ม", filed: "createdAt" },
  { text: " เข้าสู่ระบบล่าสุด", filed: "lastestLogin" },
  { text: "ช่องทางการติดต่อ" },
  { text: "เบอร์โทร", filed: "phone" },
  { text: "อีเมล", filed: "email" },
];

const ExportAdminBtn = () => {
  const [fileName, setFileName] = useState("");
  const [exporting, setExporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);

  const [selectDataFiled, setAdminDataField] = useState(
    ADMIN_DATA_FILED.map((r) => r.filed),
  );
  const handleSelectAllAdminField = () => {
    if (selectDataFiled.length === ADMIN_DATA_FILED.length) {
      setAdminDataField([]);
    } else {
      setAdminDataField(ADMIN_DATA_FILED.map((r) => r.filed));
    }
  };
  const handleSelectAdminField = (facId) => {
    if (facId === "all") {
      handleSelectAllAdminField();
    } else {
      setAdminDataField((prev) =>
        prev.includes(facId)
          ? prev.filter((p) => p !== facId && p !== "all")
          : [...prev, facId],
      );
    }
  };

  const exportData = async () => {
    if (!fileName) return alerts.warning("กรุณาตั้งชื่อไฟล์");
    setExporting(true);
    try {
      setProgress(0);

      const res = await axios.post(
        apiConfig.rmuAPI + "/president/export-admin-data",
        {
          fileName,
          selectDataFiled,
        },

        {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              setProgress(percent);
            }
          },
        },
      );

      if (res.data.err) {
        return alerts.warning(res.data.err);
      }
      if (res.status === 200) {
        const normalize = res?.data?.map((d) => ({
          ...(d?.prefix && { คำนำหน้า: d?.prefix }),
          ...(d?.fname && { ชื่อ: d?.fname }),
          ...(d?.lname && { นามสกุล: d?.lname }),
          ...(d?.createdAt && { วันทีเพิ่ม: DateTHFormat(d?.createdAt) }),
          ...(d?.lastestLogin && {
            เข้าสู่ระบบล่าสุด: DateTHFormat(d?.lastestLogin),
          }),
          ...(d?.phone && { เบอร์โทรศัพท์: d?.phone }),
          ...(d?.email && { อีเมล: d?.email }),
        }));
        console.log("🚀 ~ exportData ~ res?.data:", res?.data)

        ExportExcel(normalize, fileName);
        alerts.success(
          `ส่งออกรายงานสำเร็จ! ดาวน์โหลดไฟล์ ${fileName}.xlxs แล้ว!`,
        );
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={exporting}
        className="p-2 hover:text-white border border-gray-100 bg-gray-100 hover:from-blue-500 hover:bg-linear-90 hover:to-sky-300 px-3.5 rounded-lg shadow-xs flex justify-center items-center gap-2"
      >
        {exporting ? (
          <>
            <Loader2 size={17} className="animate-spin" />
            <p className="text-sm">กำลังส่งออก...</p>
          </>
        ) : (
          <>
            {" "}
            <Download size={17} />
            <p className="text-sm">ส่งออกรายชื่อ</p>
          </>
        )}
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="w-full z-50 lg:w-1/3 flex flex-col p-5 rounded-lg bg-white">
          <div className="w-full flex items-start pb-3 border-b border-gray-300 justify-between">
            <span className="flex flex-col">
              <p className="text-lg font-bold">ดาวน์โหลดรายชื่อผู้ดูแล</p>
              <p className="text-sm text-gray-700">
                เลือกข้อมูลที่ต้องการเพื่อดาวน์โหลดไฟล์ .xlxs
              </p>
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <p className="text-sm mt-3.5">ชื่อไฟล์</p>
          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            type="text"
            className="w-full p-2 mt-1.5 px-3 rounded-lg text-sm border border-gray-300 shadow-xs focus:border-blue-500"
            placeholder="เช่น รายชื่อผู้ดูแล_2569"
          />
          <p className="text-sm mt-3.5">เลือกข้อมูลที่ต้องการส่งออก</p>

          <div className="mt-1.5 w-full grid grid-cols-2 items-center gap-2.5">
            {ADMIN_DATA_FILED.map((a, index) => {
              if (a.filed) {
                return (
                  <span
                    key={index}
                    onClick={() => handleSelectAdminField(a.filed)}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      readOnly
                      checked={selectDataFiled.includes(a.filed)}
                      type="checkbox"
                      name=""
                      id=""
                    />
                    <p>{a.text}</p>
                  </span>
                );
              } else {
                return (
                  <p key={index} className="text-sm col-span-2 text-gray-600">
                    {a.text}
                  </p>
                );
              }
            })}
          </div>
          <div className="mt-3.5 pt-3.5 border-t border-gray-300 flex items-center gap-2 justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="text-sm p-2 px-3 rounded-lg border border-gray-300 shadow-sm"
            >
              ยกเลิก
            </button>
            <button
              onClick={exportData}
              disabled={exporting}
              className="p-2 px-3 text-sm hover:bg-blue-600 rounded-lg flex items-center gap-2 shadow-sm bg-blue-500 text-white"
            >
              {exporting ? (
                <>
                  <Loader2 className="animate-spin" />
                  <p>กำลังส่งออก...</p>
                </>
              ) : (
                <>
                  {" "}
                  <Download size={18} />
                  <p>ส่งออก</p>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
      <LoadingWithProgess
        afterLoad={"กำลังโหลดไฟล์..."}
        isOpen={exporting}
        loadingText={"กำลังค้นหาข้อมูล..."}
        percent={progress}
      />
    </>
  );
};
export default ExportAdminBtn;
