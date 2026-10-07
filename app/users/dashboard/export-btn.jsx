"use client";
import LoadingWithProgess from "@/components/loading-wite-progress";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";

const ExportBtn = ({
  selecetFacultyId,
  selectDepartmentId,
  selectYearStart,
  selectYearEnd,
}) => {
  const [progress, setProgress] = useState(0);
  const [load, setLoad] = useState(false);

  const handleExport = async () => {
    setLoad(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/export-alumni-overview",
        {
          withCredentials: true,
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              setProgress(percent);
            }
          },
          params: {
            selecetFacultyId: Array.isArray(selecetFacultyId)
              ? selecetFacultyId.filter(Boolean)
              : selecetFacultyId
                ? [selecetFacultyId]
                : undefined,
            selectDepartmentId: Array.isArray(selectDepartmentId)
              ? selectDepartmentId.filter(Boolean)
              : selectDepartmentId
                ? [selectDepartmentId]
                : undefined,
            selectYearStart: selectYearStart || undefined,
            selectYearEnd: selectYearEnd || undefined,
          },
        },
      );
      if (res.status === 200) {
        if (
          res.data?.type === "application/json" ||
          (res.data instanceof Blob && res.data.type?.includes("json"))
        ) {
          const text = await res.data.text();
          try {
            const parsed = JSON.parse(text);
            return alerts.warning(parsed.err || "ไม่สามารถส่งออกไฟล์ PDF ได้");
          } catch {
            return alerts.warning(text);
          }
        }

        if (!res.data || (res.data instanceof Blob && res.data.size < 100)) {
          return alerts.err("ไฟล์ PDF ที่ได้รับจากเซิร์ฟเวอร์ไม่สมบูรณ์");
        }

        const blob = new Blob([res.data], {
          type: "application/pdf",
        });

        const pdfUrl = URL.createObjectURL(blob);
        const fileName = "รายงานสรุปสถิติภาพรวมศิษย์เก่า.pdf";

        const downloadLink = document.createElement("a");
        downloadLink.href = pdfUrl;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        const previewTab = window.open(pdfUrl, "_blank");
        if (previewTab) {
          previewTab.focus();
        }

        alerts.success("ส่งออกรายงาน PDF สำเร็จ!");

        setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
        }, 600000);
      }
    } catch (error) {
      console.error(error);
      alerts.err("ไม่สามารถส่งออกรายงานได้ในขณะนี้");
    } finally {
      setLoad(false);
      setProgress(0);
    }
  };

  return (
    <>
      <button
        disabled={load}
        onClick={handleExport}
        className="h-[38px] px-3.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {load ? (
          <Loader2 size={16} className="animate-spin text-gray-500" />
        ) : (
          <FileDown size={16} className="text-gray-500" />
        )}
        <span>{load ? "กำลังส่งออก..." : "ส่งออกรายงาน"}</span>
      </button>
      <LoadingWithProgess
        afterLoad={"กำลังสร้างเอกสาร..."}
        isOpen={load}
        loadingText={"กำลังประมวลผลข้อมูลรายงาน..."}
        percent={progress}
      />
    </>
  );
};
export default ExportBtn;
