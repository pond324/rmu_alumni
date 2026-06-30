import LoadingWithProgess from "@/components/loading-wite-progress";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { File } from "lucide-react";
import { useState } from "react";

const ExportBtn = ({selecetFacultyId, selectDepartmentId, selectYearStart}) => {
  const [progress, setProgress] = useState(0);
  const [load, setLoad] = useState(false);
  const handleExport = async ({}) => {
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
          params:{
            selecetFacultyId, selectDepartmentId, selectYearStart
          }
        },
      );
      if (res.status === 200) {
        const blob = new Blob([res.data], {
          type: "application/pdf",
        });

        const pdfUrl = URL.createObjectURL(blob);

        window.open(pdfUrl, "_blank");

        setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
        }, 1000);
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
        disabled={load}
        onClick={handleExport}
        className="p-2 hover:bg-blue-500 hover:text-white px-3 rounded-lg flex items-center gap-2 shadow-sm bg-gray-100 text-sm"
      >
        <File size={18} />
        <p>ส่งออกรายงาน</p>
      </button>
      <LoadingWithProgess
        afterLoad={"กำลังสร้างเอกสาร..."}
        isOpen={load}
        loadingText={"กำลังโหลดข้อมูล..."}
        percent={progress}
      />
    </>
  );
};
export default ExportBtn;
