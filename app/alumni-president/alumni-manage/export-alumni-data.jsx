import ExportDataSelection from "@/components/export-data-selection";
import { departmentText, facultyText } from "@/components/faculty-p";
import LoadingWithProgess from "@/components/loading-wite-progress";
import { apiConfig } from "@/config/api.config";
import { useFacultyDep } from "@/hook/useFacultyDep";
import UseStdYearOptions from "@/hook/useStdYearOptions";
import { alerts } from "@/libs/alerts";
import ExportExcel from "@/libs/export-excel";
import axios from "axios";
import { File, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const ALUMNI_DATA_FIELD = [
  { text: "ข้อมูลทั่วไป" },
  { text: " รหัสนักศึกษา", filed: "alumni_id" },
  { text: " คำหน้า", filed: "prefix" },
  { text: " ชื่อ", filed: "fname" },
  { text: " นามสกุล", filed: "lname" },
  { text: " ปีที่เข้าศึกษา", filed: "year_start" },
  { text: " ปีที่จบการศึกษา", filed: "year_end" },
  { text: "ช่องทางการติดต่อ" },
  { text: " ที่อยู่", filed: "address" },
  { text: "เบอร์โทร", filed: "phone" },
  { text: "อีเมล", filed: "email" },
  { text: "เฟสบุ๊ค(Facebook)", filed: "facebook" },
];

const ExportAlumniData = () => {
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
    setSelectFacultyId(faculties.map((f) => f?.value));
    setSelectDepartmentId(departments.map((d) => d?.value));
  }, [faculties, departments]);
  useEffect(() => {
    if (!departments) return;
    if (!facultyId) {
      setDepartmentList(departments);
      return;
    }
    let normalizedData = departments.filter(
      (d) =>
        String(d?.faculty_id) === String(facultyId) ||
        String(d?.faculty?.faculty_id) === String(facultyId),
    );
    if (departmentId) {
      normalizedData = normalizedData.filter(
        (d) =>
          String(d?.id) === String(departmentId) ||
          String(d?.value) === String(departmentId),
      );
    }
    setDepartmentList(normalizedData);
  }, [facultyId, departmentId, departments]);

  useEffect(() => {
    if (!faculties) return;
    if (!facultyId) {
      setFacultyList(faculties);
      return;
    }
    setFacultyList(
      faculties.filter(
        (d) =>
          String(d?.id) === String(facultyId) ||
          String(d?.value) === String(facultyId),
      ),
    );
  }, [facultyId, faculties]);

  useEffect(() => {
    setSelectYearEnd(yearEndOptions.map((y) => y));
    setSelectYearStart(yearStartOptions.map((y) => y));
  }, [yearEndOptions, yearStartOptions]);

  const handleSelectAllFacId = () => {
    const currentFacIds = (faultyList || []).map((f) => f?.value || f?.id);
    const allSelected =
      currentFacIds.length > 0 &&
      currentFacIds.every((id) => selecetFacultyId.includes(id));
    if (allSelected) {
      setSelectFacultyId((prev) =>
        prev.filter((id) => !currentFacIds.includes(id)),
      );
    } else {
      setSelectFacultyId((prev) =>
        Array.from(new Set([...prev, ...currentFacIds])),
      );
    }
  };

  const handleSelectFacultyId = (facId) => {
    setSelectFacultyId((prev) =>
      prev.includes(facId) ? prev.filter((p) => p !== facId) : [...prev, facId],
    );
  };

  const handleSelectAllDepId = () => {
    const currentDepIds = (departmentList || []).map((f) => f?.value || f?.id);
    const allSelected =
      currentDepIds.length > 0 &&
      currentDepIds.every((id) => selectDepartmentId.includes(id));
    if (allSelected) {
      setSelectDepartmentId((prev) =>
        prev.filter((id) => !currentDepIds.includes(id)),
      );
    } else {
      setSelectDepartmentId((prev) =>
        Array.from(new Set([...prev, ...currentDepIds])),
      );
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

  const [selectDataFiled, setAlumniDataField] = useState(
    ALUMNI_DATA_FIELD.map((r) => r.filed),
  );
  const handleSelectAllAlumniField = () => {
    if (selectDataFiled.length === ALUMNI_DATA_FIELD.length) {
      setAlumniDataField([]);
    } else {
      setAlumniDataField(ALUMNI_DATA_FIELD.map((r) => r.filed));
    }
  };
  const handleSelectALumniField = (facId) => {
    if (facId === "all") {
      handleSelectAllAlumniField();
    } else {
      setAlumniDataField((prev) =>
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
    selectYearEnd,
    selectYearStart,
    selectAlumniField,
  ) => {
    if (!fileName) return alerts.warning("กรุณาตั้งชื่อไฟล์สำหรับการส่งออก");
    setExporting(true);
    try {
      setProgess(0);
      if (selecetFacultyId.length < 1)
        return alerts.warning("กรุณาเลือกอย่างน้อย 1 คณะ");
      if (selectDepartmentId.length < 1)
        return alerts.warning("กรุณาเลือกอย่างน้อย 1 สาขาวิชา");
      if (selectYearStart.length < 1)
        return alerts.warning("กรุณาเลือกอย่างน้อย 1 ปีการศึกษา");
      if (selectFileType == 1 && selectAlumniField.length < 1)
        return alerts.warning("กรุณาเลือกอย่างน้อย 1 ข้อมูลในการส่งออก");
      const res = await axios.post(
        apiConfig.rmuAPI + "/president/export-alumni-data",
        {
          selecetFacultyId,
          selectDepartmentId,
          selectFileType,
          selectYearEnd,
          selectYearStart,
          fileName: fileName,
          selectAlumniField,
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

      if (res.status === 200) {
        if (selectFileType == 1) {
          if (res.data?.err) {
            return alerts.warning(res.data.err);
          }
          const normalize = res?.data?.map((d) => ({
            ...(d?.prefix && { คำนำหน้า: d?.prefix }),
            ...(d?.alumni_id && { รหัสนักศึกษา: d?.alumni_id }),
            ...(d?.fname && { ชื่อ: d?.fname }),
            ...(d?.lname && { นามสกุล: d?.lname }),
            คณะ: facultyText(faculties, d?.facultyId),
            สาขาวิชา: departmentText(departments, d?.departmentId),
            ...(d?.year_start && { ปีที่เข้าศึกษา: d?.year_start }),
            ...(d?.year_end && { ปีที่จบการศึกษา: d?.year_end }),
            ...(selectAlumniField.includes("address") && {
              ที่อยู่: d?.alumni_contract?.address,
              จังหวัด: d?.alumni_contract?.province,
              อำเภอ: d?.alumni_contract?.amphure,
              ตำบล: d?.alumni_contract?.tambon,
              รหัสไปษณีย์: d?.alumni_contract?.zipcode,
            }),
            ...(d?.alumni_contract?.phone1 && {
              เบอร์โทรศัพท์: d?.alumni_contract?.phone1,
            }),
            ...(d?.alumni_contract?.phone2 && {
              เบอร์โทรศัพท์: d?.alumni_contract?.phone2,
            }),
            ...(d?.alumni_contract?.email1 && {
              อีเมล: d?.alumni_contract?.email1,
            }),
            ...(d?.alumni_contract?.email2 && {
              อีเมล: d?.alumni_contract?.email2,
            }),
            ...(d?.alumni_contract?.facebook && {
              เฟสบุ๊ค: d?.alumni_contract?.facebook,
            }),
          }));

          ExportExcel(normalize, fileName);
          alerts.success(
            `ส่งออกรายงานสำเร็จ! ดาวน์โหลดไฟล์ ${fileName}.xlsx แล้ว!`,
          );
        } else {
          // Check if server returned a JSON error disguised as a blob
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
          const finalPdfName = fileName
            ? fileName.toLowerCase().endsWith(".pdf")
              ? fileName
              : `${fileName}.pdf`
            : "รายงานข้อมูลศิษย์เก่า.pdf";

          // 1. Direct browser download
          const downloadLink = document.createElement("a");
          downloadLink.href = pdfUrl;
          downloadLink.download = finalPdfName;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          // 2. Open in new tab for preview
          const previewTab = window.open(pdfUrl, "_blank");
          if (previewTab) {
            previewTab.focus();
          }

          alerts.success(`ส่งออกรายงาน PDF สำเร็จ! ดาวน์โหลดไฟล์ ${finalPdfName} แล้ว`);

          // 3. Keep blob URL in memory for 10 minutes so Chrome's PDF viewer won't get ERR_FILE_NOT_FOUND
          setTimeout(() => {
            URL.revokeObjectURL(pdfUrl);
          }, 600000);
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
            <p className="text-sm">ส่งออกข้อมูล</p>
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
                <div className="w-full flex items-center justify-between">
                  <p className="mt-3.5 text-sm">เลือกข้อมูลที่ต้องการ</p>
                  <span
                    onClick={() => handleSelectAllAlumniField()}
                    className="flex hover:underline items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      readOnly
                      checked={
                        selectDataFiled.length === ALUMNI_DATA_FIELD.length
                      }
                      type="checkbox"
                      name=""
                      id=""
                    />
                    <p className="text-blue-500">เลือกทั้งหมด</p>
                  </span>
                </div>

                <div className="mt-1.5 w-full grid grid-cols-2 items-center gap-2.5">
                  {ALUMNI_DATA_FIELD.map((a, index) => {
                    if (a.filed) {
                      return (
                        <span
                          key={index}
                          onClick={() => handleSelectALumniField(a.filed)}
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
                        <p
                          key={index}
                          className="text-sm col-span-2 text-gray-600"
                        >
                          {a.text}
                        </p>
                      );
                    }
                  })}
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
            selectYearEnd,
            selectYearStart,
            selectDataFiled,
          )
        }
        handleSelectYearStart={handleSelectYearStart}
        sectionHeder={"ส่งออกข้อมูลศิษย์เก่า"}
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
export default ExportAlumniData;
