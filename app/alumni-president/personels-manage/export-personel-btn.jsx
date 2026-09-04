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

const PERSONEL_DATA_FIELD = [
  { text: "ข้อมูลทั่วไป" },
  { text: " รหัสประจำตัวบุคลากร", filed: "professor_id" },
  { text: " คำนำหน้า", filed: "prefix" },
  { text: " ตำแหน่งทางวิชาการ", filed: "academic_rank" },
  { text: " ชื่อ", filed: "fname" },
  { text: " นามสกุล", filed: "lname" },
  { text: " ตำแหน่ง", filed: "univercity_position" },
  { text: "ช่องทางการติดต่อ" },
  { text: " ที่อยู่", filed: "address" },
  { text: "เบอร์โทร", filed: "phone" },
  { text: "อีเมล", filed: "email" },
  { text: "เฟสบุ๊ค(Facebook)", filed: "facebook" },
];

const UNIVERSITY_POSITION = [
  "ทุกตำแหน่ง",
  "อธิการบดี",
  "รองอธิการบดี",
  "คณบดี",
  "รองคณบดี",
  "อาจารย์",
];

const ExportPersonelBtn = () => {
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
    if (!departments) return;
    if (!facultyId) {
      setDepartmentList(departments);
      return;
    }
    let normalizedData = departments.filter(
      (d) => String(d?.faculty_id) === String(facultyId),
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

  const [selectDataFiled, setPersonelDataField] = useState(
    PERSONEL_DATA_FIELD.map((r) => r.filed),
  );
  const handleSelectAllAlumniField = () => {
    if (selectDataFiled.length === PERSONEL_DATA_FIELD.length) {
      setPersonelDataField([]);
    } else {
      setPersonelDataField(PERSONEL_DATA_FIELD.map((r) => r.filed));
    }
  };
  const handleSelectALumniField = (facId) => {
    if (facId === "all") {
      handleSelectAllAlumniField();
    } else {
      setPersonelDataField((prev) =>
        prev.includes(facId)
          ? prev.filter((p) => p !== facId && p !== "all")
          : [...prev, facId],
      );
    }
  };

  const [selectPosition, setSelectPosition] = useState(UNIVERSITY_POSITION);
  const handleSelectPosition = async (position) => {
    if (position === "ทุกตำแหน่ง") {
      setSelectPosition((prev) => (prev.length < 1 ? UNIVERSITY_POSITION : []));
    } else {
      setSelectPosition((prev) =>
        prev.includes(position)
          ? prev.filter((p) => p !== position && p !== "ทุกตำแหน่ง")
          : [...prev, position],
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
    selectPersonelField,
    selectPosition,
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
      if (selectFileType == 1 && selectPersonelField.length < 1)
        return alerts.warning("กรุณาเลือกอย่างน้อย 1 ข้อมูลในการส่งออก");
      if (selectFileType == 1 && selectPosition.length < 1)
        return alerts.warning("กรุณาเลือกอย่างน้อย 1 ข้อมูลในการส่งออก");
      const res = await axios.post(
        apiConfig.rmuAPI + "/president/export-personel-data",
        {
          selecetFacultyId,
          selectDepartmentId,
          selectFileType,
          selectYearEnd,
          selectYearStart,
          fileName: fileName,
          selectPersonelField,
          selectPosition,
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
            ...(d?.professor_id && { รหัสประจำตัวบุคลากร: d?.professor_id }),
            ...(d?.prefix && { คำนำหน้า: d?.prefix }),
            ...(d?.academic_rank && { ตำแหน่งทางวิชาการ: d?.academic_rank }),
            ...(d?.fname && { ชื่อ: d?.fname }),
            ...(d?.lname && { นามสกุล: d?.lname }),
            ...(d?.univercity_position && {
              ดำรงตำแหน่ง: d?.univercity_position,
            }),
            คณะ: facultyText(faculties, d?.facultyId),
            สาขาวิชา: departmentText(departments, d?.departmentId),
            ...(selectPersonelField.includes("address") && {
              ที่อยู่: d?.professor_contract?.address,
              จังหวัด: d?.professor_contract?.province,
              อำเภอ: d?.professor_contract?.amphure,
              ตำบล: d?.professor_contract?.tambon,
              รหัสไปษณีย์: d?.professor_contract?.zipcode,
            }),
            ...(d?.professor_contract?.phone1 && {
              เบอร์โทรศัพท์: d?.professor_contract?.phone1,
            }),
            ...(d?.professor_contract?.phone2 && {
              เบอร์โทรศัพท์: d?.professor_contract?.phone2,
            }),
            ...(d?.professor_contract?.email1 && {
              อีเมล: d?.professor_contract?.email1,
            }),
            ...(d?.professor_contract?.email2 && {
              อีเมล: d?.professor_contract?.email2,
            }),
            ...(d?.professor_contract?.facebook && {
              เฟสบุ๊ค: d?.professor_contract?.facebook,
            }),
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
            <p className="mt-3.5 text-sm">เลือกตำแหน่ง</p>
            <div className="w-full flex items-center mt-1.5 gap-3.5 flex-wrap">
              {UNIVERSITY_POSITION.map((u, index) => (
                <span
                  key={index}
                  onClick={() => handleSelectPosition(u)}
                  className="flex hover:underline items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    readOnly
                    checked={
                      u === "ทุกตำแหน่ง"
                        ? selectPosition.length >= 5
                        : selectPosition.includes(u)
                    }
                    type="checkbox"
                    name=""
                    id=""
                  />
                  <p className="">{u}</p>
                </span>
              ))}
            </div>
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
                        selectDataFiled.length === PERSONEL_DATA_FIELD.length
                      }
                      type="checkbox"
                      name=""
                      id=""
                    />
                    <p className="text-blue-500">เลือกทั้งหมด</p>
                  </span>
                </div>

                <div className="mt-1.5 w-full grid grid-cols-2 items-center gap-2.5">
                  {PERSONEL_DATA_FIELD.map((a, index) => {
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
            selectPosition,
          )
        }
        handleSelectYearStart={handleSelectYearStart}
        sectionHeder={"ส่งออกข้อมูลบุคลากร"}
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
export default ExportPersonelBtn;
