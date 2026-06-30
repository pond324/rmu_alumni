import ExportDataSelection from "@/components/export-data-selection";
import { departmentText, facultyText } from "@/components/faculty-p";
import LoadingWithProgess from "@/components/loading-wite-progress";
import { apiConfig } from "@/config/api.config";
import { useFacultyDep } from "@/hook/useFacultyDep";
import UseStdYearOptions from "@/hook/useStdYearOptions";
import { alerts } from "@/libs/alerts";
import ExportExcel from "@/libs/export-excel";
import axios from "axios";
import { Download, File, ListRestart, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

const REGIS_STATUS = [
  { value: "all", name: "ทุกสถานะ" },
  { value: "no_regis", name: "ยังไม่ลงทะเบียน" },
  { value: "accept", name: "ลงทะเบียนแล้ว" },
  { value: "pending", name: "รอตรวจสอบ" },
  { value: "refuse", name: "ปฏิเสธ" },
];

const ExportRegisAlumniBtn = () => {
  const { yearEndOptions, yearStartOptions } = UseStdYearOptions();
  const [showModal, setShowModal] = useState(false);
  const [load, setLoad] = useState(false);
  const [selectFileType, setSelectFileType] = useState(1);
  const { departments, loadData, faculties } = useFacultyDep();
  const [departmentList, setDepartmentList] = useState(departments || []);
  const [faultyList, setFacultyList] = useState(faculties || []);
  const [selecetFacultyId, setSelectFacultyId] = useState([]);
  const [selectDepartmentId, setSelectDepartmentId] = useState([]);
  const [selectYearStart, setSelectYearStart] = useState([]);
  const [selectYearEnd, setSelectYearEnd] = useState([]);
  const [facultyId, setFacultyId] = useState("");
  const [faculty, setFaculty] = useState(null);
  const [departmentId, setDepartmentId] = useState("");
  const resetSearch = () => {
    setFaculty(null);
    setFacultyId(null);
    setDepartmentId(null);
    setDepartmentList(departments);
    setFacultyList(faculties);
  };

  useEffect(() => {
    if (!faculties || !departments) return;
    setDepartmentList(departments || []);
    setFacultyList(faculties || []);
    setSelectFacultyId(faculties.map((f) => f?.id));
    setSelectDepartmentId(departments.map((d) => d?.id));
  }, [faculties, departments]);
  useEffect(() => {
    if (!departments || !facultyId) return;
    let normalizedData = departmentList;
    if (facultyId) {
      normalizedData = departments.filter((d) =>
        [62, 28].includes(Number(facultyId))
          ? d?.id?.startsWith(facultyId)
          : Number(facultyId) === 16
            ? d?.id?.startsWith("61")
            : Number(facultyId) === 12
              ? Number(d?.id.substring(0, 4)) > 2000 &&
                Number(d?.id.substring(0, 4)) < 2029
              : Number(facultyId) === 21
                ? Number(d?.id.substring(0, 4)) > 2028 &&
                  Number(d?.id.substring(0, 4)) < 3000
                : d?.id?.substring(1, 2) == 0 &&
                  d?.id?.substring(0, 1) == String(facultyId)?.substring(1, 2),
      );
    }
    if (departmentId) {
      normalizedData = normalizedData.filter(
        (d) => d?.id === departmentId || d?.value === departmentId,
      );
    }
    setDepartmentList(normalizedData);
  }, [facultyId, departmentId]);
  useEffect(() => {
    if (!facultyId) return;
    setFacultyList(faculties.filter((d) => d?.id === facultyId));
  }, [facultyId]);
  useEffect(() => {
    setSelectYearEnd(yearEndOptions.map((y) => y));
    setSelectYearStart(yearStartOptions.map((y) => y));
  }, [yearEndOptions, yearStartOptions]);

  const handleSelectAllFacId = () => {
    if (selecetFacultyId.length === faculties.length) {
      setSelectFacultyId([]);
    } else {
      setSelectFacultyId(faculties.map((f) => f?.id));
    }
  };
  const handleSelectFacultyId = (facId) => {
    setSelectFacultyId((prev) =>
      prev.includes(facId) ? prev.filter((p) => p !== facId) : [...prev, facId],
    );
  };
  const handleSelectAllDepId = () => {
    if (selectDepartmentId.length === departments.length) {
      setSelectDepartmentId([]);
    } else {
      setSelectDepartmentId(departments.map((f) => f?.id));
    }
  };
  const handleSelectDepId = (facId) => {
    setSelectDepartmentId((prev) =>
      prev.includes(facId) ? prev.filter((p) => p !== facId) : [...prev, facId],
    );
  };
  const handleSelectAllYearStart = () => {
    if (selectYearStart.length === yearStartOptions.length) {
      setSelectYearStart([]);
    } else {
      setSelectYearStart(yearStartOptions);
    }
  };
  const handleSelectYearStart = (facId) => {
    setSelectYearStart((prev) =>
      prev.includes(facId) ? prev.filter((p) => p !== facId) : [...prev, facId],
    );
  };

  const [selectRegisStatus, setSelectResigStatus] = useState(
    REGIS_STATUS.map((r) => r.value),
  );
  const handleSelectAllRegisStatus = () => {
    if (selectRegisStatus.length === REGIS_STATUS.length) {
      setSelectResigStatus([]);
    } else {
      setSelectResigStatus(REGIS_STATUS.map((r) => r.value));
    }
  };
  const handleSelectRegisStats = (facId) => {
    if (facId === "all") {
      handleSelectAllRegisStatus();
    } else {
      setSelectResigStatus((prev) =>
        prev.includes(facId)
          ? prev.filter((p) => p !== facId && p !== "all")
          : [...prev, facId],
      );
    }
  };
  const [fileName, setFileName] = useState("");
  const [exporting, setExporting] = useState(false);
  const [progress, setProgess] = useState(0);
  const exportData = async (
    selecetFacultyId,
    selectDepartmentId,
    selectFileType,
    selectRegisStatus,
    selectYearEnd,
    selectYearStart,
  ) => {
    if (!fileName) return alerts.warning("กรุณาตั้งชื่อไฟล์สำหรับการส่งออก");
    if (selecetFacultyId.length < 1)
      return alerts.warning("กรุณาเลือกอย่างน้อย 1 คณะ");
    if (selectDepartmentId.length < 1)
      return alerts.warning("กรุณาเลือกอย่างน้อย 1 สาขาวิชา");
    if (selectYearStart.length < 1)
      return alerts.warning("กรุณาเลือกอย่างน้อย 1 ปีการศึกษา");
    if (selectRegisStatus.length < 1 && selectFileType == 1)
      return alerts.warning("กรุณาเลือกอย่างน้อย 1 สถานะ");
    setExporting(true);
    try {
      setProgess(0);
      const res = await axios.post(
        apiConfig.rmuAPI + "/president/export-alumni-regis",
        {
          selecetFacultyId,
          selectDepartmentId,
          selectFileType,
          selectRegisStatus,
          selectYearEnd,
          selectYearStart,
          fileName: fileName,
        },

        {
          withCredentials: true,
          ...(selectFileType == 2 && { responseType: "blob" }),
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              setProgess(percent);
            }
          },
        },
      );

      if (res.data.err) {
        return alerts.warning(res.data.err);
      }
      if (res.status === 200) {
        if (selectFileType == 1) {
          const normalize = res?.data?.map((d) => ({
            รหัสนักศึกษา: d?.alumni_id,
            คำนำหน้า: d?.prefix,
            ชื่อ: d?.fname,
            นามสกุล: d?.lname,
            คณะ: facultyText(faculties, d?.facultyId),
            สาขาวิชา: departmentText(departments, d?.departmentId),
            "ปีการศึกษา(พ.ศ.)": `${d?.year_start} - ${d?.year_end}`,
            สถานะลงทะเบียน: !d?.regis_alumni
              ? "ยังไม่ลงทะเบียน"
              : d?.regis_alumni?.isApproved === "pending"
                ? "รอตรวจสอบ"
                : d?.regis_alumni?.isApproved === "accept"
                  ? "ลงทะเบียนแล้ว"
                  : "ถูกปฏิเสธ",
          }));
          ExportExcel(normalize, fileName);
          alerts.success(
            `ส่งออกรายงานสำเร็จ! ดาวน์โหลดไฟล์ ${fileName}.xlxs แล้ว!`,
          );
        } else {
          const blob = new Blob([res.data], {
            type: "application/pdf",
          });

          const pdfUrl = URL.createObjectURL(blob);

          window.open(pdfUrl, "_blank");

          setTimeout(() => {
            URL.revokeObjectURL(pdfUrl);
          }, 1000);
        }
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
        disabled={load || exporting}
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
            <File size={17} />
            <p className="text-sm">ส่งออกรายงาน</p>
          </>
        )}
      </button>
      <ExportDataSelection
        departmentId={departmentId}
        faculty={faculty}
        facultyId={facultyId}
        fileName={fileName}
        loadData={loadData}
        otherSelectIion={
          <>
            {selectFileType === 1 && (
              <>
                {" "}
                <p className="text-sm">สถานะ</p>
                <div className="flex mt-1.5 text-sm items-center flex-wrap gap-2">
                  {REGIS_STATUS.map((r, index) => (
                    <div
                      onClick={() => handleSelectRegisStats(r.value)}
                      key={index}
                      className="flex items-center cursor-pointer gap-2"
                    >
                      <input
                        checked={selectRegisStatus.includes(r.value)}
                        readOnly
                        type="checkbox"
                        className="w-4 h-4 accent-blue-500 cursor-pointer"
                      />
                      <p>{r?.name}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        }
        resetSearch={resetSearch}
        selectFileType={selectFileType}
        setDepartmentId={setDepartmentId}
        setFaculty={setFaculty}
        setFacultyId={setFacultyId}
        setFileName={setFileName}
        setSelectFileType={setSelectFileType}
        setShowModal={setShowModal}
        showModal={showModal}
        departmentList={departmentList}
        departments={departments}
        faculties={faculties}
        faultyList={faultyList}
        handleSelectAllDepId={handleSelectAllDepId}
        handleSelectAllFacId={handleSelectAllFacId}
        handleSelectAllYearStart={handleSelectAllYearStart}
        handleSelectDepId={handleSelectDepId}
        handleSelectFacultyId={handleSelectFacultyId}
        selecetFacultyId={selecetFacultyId}
        selectDepartmentId={selectDepartmentId}
        selectYearStart={selectYearStart}
        yearStartOptions={yearStartOptions}
        exportData={() =>
          exportData(
            selecetFacultyId,
            selectDepartmentId,
            selectFileType,
            selectRegisStatus,
            selectYearEnd,
            selectYearStart,
          )
        }
        handleSelectYearStart={handleSelectYearStart}
        sectionHeder={"ส่งออกข้อมูลการลงทะเบียน"}
        sectionDes={"เลือกรูปแบบไฟล์และตัวกรองข้อมูลที่ต้องการส่งออก"}
      />

      <LoadingWithProgess
        isOpen={exporting}
        loadingText={"กำลังสร้างเอกสาร... โปรดรอสักครู่"}
        percent={progress}
      />
    </>
  );
};
export default ExportRegisAlumniBtn;
