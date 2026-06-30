import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  File,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";
import Modal from "../../../components/modal";
import uuid from "@/libs/uuid";
import * as XLSX from "xlsx";
import { alerts } from "@/libs/alerts";
import Papa from "papaparse";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import ViewFaculty from "./view-facultyid";
import ViewDepartment from "./view-departmentid";
import ViewAlumniData from "./view-alumni-data";
import ViewEduLevel from "./view-edulevel";
import LoadingWithProgess from "@/components/loading-wite-progress";

const ALUMNI_DATA_HEADER_COLUNM = [
  "alumni_id",
  "prefix",
  "fname",
  "lname",
  "year_start",
  "year_end",
  "facultyId",
  "departmentId",
  "edu_levelId",
];
const ALUMNI_DATA_HEADER_MEAN = [
  "รหัสนักศึกษา",
  "คำนำหน้า",
  "ชื่อ",
  "นามสกุล",
  "ปีที่เข้าศึกษา",
  "ปีที่จบการศึกษา",
  "รหัสคณะ",
  "รหัสสาขาวิชา",
  "รหัสระดับการศึกษา",
];

const ImportAlumniData = ({ fetchData }) => {
  const pathName = usePathname();
  if (pathName !== "/alumni-president/alumni-manage") return null;

  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState();
  const [error, setError] = useState();

  const [headers, setHeaders] = useState([]);
  const [json, setJson] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const pageSize = 100;

  const start = (page - 1) * pageSize;
  const end = page * pageSize;

  const nextPage = () => {
    if (page >= totalPage) return;
    setPage((prev) => prev + 1);
  };

  const backPage = () => {
    if (page <= 1) return;
    setPage((prev) => prev - 1);
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    // check type
    if (!allowedTypes.includes(file.type)) {
      alerts.warning("อนุญาตเฉพาะ Excel หรือ CSV");
      return;
    }
    setFile(file);

    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        encoding: "utf-8 unicode",
        dynamicTyping: false,
        complete: (result) => {
          const data = result.data;

          const corruptedColumns = new Set();

          data.forEach((row) => {
            Object.entries(row).forEach(([key, value]) => {
              if (/^-?\d+(\.\d+)?[eE][+-]?\d+$/.test(String(value ?? ""))) {
                corruptedColumns.add(key);
              }
            });
          });

          if (corruptedColumns.size > 0) {
            setError(
              `พบข้อมูลเสียหายใน column: ${[...corruptedColumns].join(", ")}`,
            );
            setFile(null);
            return;
          }

          // จำกัดจำนวนแถว
          if (data.length > 5000) {
            alerts.warning("ขนาดไฟล์ต้องไม่เกิน 5000 แถว");
            setFile(null);
            return;
          }

          const fixed = data.map((row) => ({
            ...row,
            alumni_id: String(row.alumni_id ?? ""),
          }));

          const header = Object.keys(fixed[0] || []);

          setJson(fixed);
          setRows(fixed);
          setHeaders(header);
          setTotalPage(Math.max(1, Math.ceil(fixed.length / 100)));

          const missing = ALUMNI_DATA_HEADER_COLUNM.filter(
            (col) => !header.includes(col),
          );

          const extra = header.filter(
            (col) => !ALUMNI_DATA_HEADER_COLUNM.includes(col),
          );

          if (missing.length > 0 || extra.length > 0) {
            setError(
              `คอลัมน์ไม่ถูกต้อง\nคอลัมน์ที่ต้องการ: ${missing.join(", ")}\nคอลัมน์เกิน: ${extra.join(", ")}`,
            );
          } else {
            setError(null);
          }
        },

        error: () => {
          alerts.warning("อ่าน CSV ไม่สำเร็จ");
        },
      });

      return;
    }

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { cellText: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const json = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
    if (json.length > 5000) {
      alerts.warning("ขนาดไฟล์ต้องไม่เกิน 5000 แถว");
      setFile(null);
      return;
    }
    setJson(json);
    const fixed = json.map((row) => ({
      ...row,
      alumni_id: String(row.alumni_id),
    }));
    setRows(fixed);

    setTotalPage(
      Math.ceil(json.length / 100) < 1 ? 1 : Math.ceil(json.length / 100),
    );

    const header = Object.keys(json[0] || {});
    setHeaders(header);

    const missing = ALUMNI_DATA_HEADER_COLUNM.filter(
      (col) => !header.includes(col),
    );

    const extra = header.filter(
      (col) => !ALUMNI_DATA_HEADER_COLUNM.includes(col),
    );
    if (missing.length > 0 || extra.length > 0) {
      setError(
        `คอลัมน์ไม่ถูกต้อง\nคอลัมน์ที่ต้องการ: ${missing.join(", ")}\nคอลัมน์เกิน: ${extra.join(", ")}`,
      );
    } else {
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "text/csv": [".csv"],
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
      },
      maxSize: 5 * 1024 * 1024, // 5MB
    });

  const onCloseModal = () => {
    setFile(null);
    setHeaders([]);
    setRows([]);
    setShowModal(false);
    setProgress(0);
    setPage(1);
    setTotalPage(
      Math.ceil(rows.length / 100) < 1 ? 1 : Math.ceil(rows.length / 100),
    );
  };

  const alertErrorDetail = () => {
    return alerts.warning(error);
  };

  const [progress, setProgress] = useState(0);
  const [importing, setImporting] = useState(false);
  const importToDb = async () => {
    const { isConfirmed } = await alerts.confirmDialog(
      "ยืนยันนำเข้าข้อมูล",
      `คุณต้องการนำเข้าข้อมูลศิษย์เก่า จำนวน ${rows.length} รายการหรือไม่`,
      "นำเข้าข้อมูล",
    );
    if (!isConfirmed) return;
    setImporting(true);

    try {
      setProgress(0);
      const formData = new FormData();
      formData.append("data", JSON.stringify(json));
      formData.append("file", file);
      formData.append("fileSize", String(file.size));
      const res = await axios.post(
        apiConfig.rmuAPI + "/president/import-confirm",
        formData,
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
      if (res.data.err) {
        return alerts.err(res.data.err);
      }
      if (res.status === 200) {
        alerts.success("นำเข้าข้อมูลสำเร็จ!");
        // onCloseModal();
        setFile(null);
        setHeaders([]);
        setRows([]);
        setProgress(0);
        setPage(1);
        setTotalPage(
          Math.ceil(rows.length / 100) < 1 ? 1 : Math.ceil(rows.length / 100),
        );
        fetchData();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setImporting(false);
    }
  };

  useEffect(() => {
    console.log(progress);
  }, [progress]);

  const deleteSelectFiles = (e) => {
    e.stopPropagation();
    setFile(null);
    setJson([]);
    setRows([]);
    setHeaders([]);
  };

  return (
    <>
      <button
        // onClick={handleExport}
        // disabled={!data}
        onClick={() => setShowModal(true)}
        className="p-2 hover:text-white bg-blue-100 hover:bg-blue-600 px-3.5 rounded-lg border border-blue-100 shadow-md flex justify-center items-center gap-2"
      >
        <Upload size={17} />
        <p className="text-sm">นำเข้าข้อมูล</p>
      </button>

      <Modal isOpen={showModal} onClose={onCloseModal}>
        <div className="z-50 w-full md:w-2/3 lg:h-auto h-[600px] overflow-auto p-5 rounded-lg flex flex-col bg-white">
          <div className="w-full flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-2">
                <FileText color="blue" />
                <p>นำเข้าข้อมูลศิษย์เก่า</p>
              </span>
              <p className="text-sm text-gray-700">
                รองรับการอัปโหลดไฟล์ CSV หรือ XLSX{" "}
              </p>
            </div>
            <button
              onClick={onCloseModal}
              className="p-2 rounded-md hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          {}
          <div
            {...getRootProps()}
            // htmlFor="file-picker"
            className={`cursor-pointer w-full mt-3.5 ${rows.length === 0 ? "border-2 border-dashed" : "overflow-auto"} lg:h-[310px] min-h-[250px] border-gray-400 hover:border-blue-500 rounded-lg justify-center flex items-center flex-col gap-1 ${isDragActive && "bg-gray-300"}`}
          >
            <input
              {...getInputProps()}
              //   type="file"
              className="hidden"
              name=""
              //   id="file-picker"
            />
            {rows.length > 0 ? (
              <>
                <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                  <span className="flex flex-wrap items-center gap-2 text-sm">
                    <File size={15} color="blue" />
                    <p>{file?.name}</p>
                    <p className="text-xs p-1 px-2 rounded-full bg-blue-50 shadow-xs font-bold text-blue text-blue-500">
                      {rows.length} รายการ
                    </p>
                    <p className="text-xs text-gray-600">
                      *แสดง 100 แถวต่อหน้า
                    </p>
                    <button
                      onClick={deleteSelectFiles}
                      className="p-1 hover:bg-red-500 hover:text-white rounded-lg shadow-sm"
                    >
                      <X size={16} />
                    </button>
                  </span>
                  <div className="flex items-center gap-2">
                    {" "}
                    <button className="text-sm p-2.5 rounded-md hover:bg-blue-500 hover:text-white">
                      เลือกไฟล์ใหม่
                    </button>
                  </div>
                </div>

                <div className="mt-2 w-full h-[300px] overflow-x-auto overflow-y-auto">
                  <table className="min-w-max w-full">
                    <thead>
                      <tr className="sticky top-0">
                        {headers.map((h, index) => (
                          <th
                            className={`text-xs bg-blue-50 text-start font-normal text-gray-700 p-2.5 ${index < 1 && "rounded-tl-lg"} ${index === headers.length - 1 && "rounded-tr-lg"}`}
                            key={uuid()}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.slice(start, end).map((r) => (
                        <tr
                          key={uuid()}
                          className="border-b border-gray-300 hover:bg-gray-50 transition-all duration-100 cursor-pointer"
                        >
                          {headers.map((h) => (
                            <td key={uuid()} className="p-2.5 text-xs">
                              {r[h]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : isDragActive ? (
              <p>ปล่อยไฟล์ที่นี่...</p>
            ) : file && fileRejections.length > 0 ? (
              <>
                <X size={30} color="gray" />
                <p className="text-red-500">
                  ไฟล์ไม่ถูกต้องหรือขนาดไฟล์ใหญ่เกินไป
                  กรุณาเลือกไฟล์ใหม่อีกครั้ง
                </p>
              </>
            ) : (
              <>
                {" "}
                <Upload color="gray" size={30} />
                <p>คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวาง</p>
                <p className="text-sm text-gray-600">
                  รองรับไฟล์ .xlsx,.xls,.csv *ข้อมูลไม่เกิน 5000 แถว
                </p>
              </>
            )}
          </div>

          {rows.length > 0 && (
            <div className="w-full flex flex-col lg:flex-row gap-3 mt-2 lg:items-center lg:justify-between">
              {error ? (
                <button
                  onClick={alertErrorDetail}
                  className="flex items-center gap-2 text-sm p-2 px-3 rounded-md bg-red-50 hover:underline hover:shadow-sm text-red-500"
                >
                  <AlertCircle size={15} />
                  <p>
                    พบข้อมูลเสียหายหรือมีคอลัมน์ที่ไม่ถูกต้อง
                    คลิกเพื่อดูรายละเอียด
                  </p>
                </button>
              ) : (
                <button
                  disabled={importing}
                  onClick={importToDb}
                  className="flex rounded-lg mt-1 justify-center bg-gray-50 items-center gap-2 p-2 px-3 text-sm hover:bg-blue-500 hover:text-white"
                >
                  {importing ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <p>กำลังนำเข้าข้อมูล...</p>
                    </>
                  ) : (
                    <>
                      {" "}
                      <Upload size={15} />
                      <p>บันทึกลงฐานข้อมูล</p>
                    </>
                  )}
                </button>
              )}

              <div className="flex gap-2.5 items-center">
                <button
                  onClick={backPage}
                  className="rounded-md p-2 bg-blue-500 text-white"
                >
                  <ArrowLeft size={15} />
                </button>
                <p className="text-sm">
                  หน้า {page} จาก {totalPage}
                </p>
                <button
                  onClick={nextPage}
                  className="rounded-md p-2 bg-blue-500 text-white"
                >
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 w-full p-3.5 rounded-lg border border-gray-100 bg-gray-50 flex flex-col">
            <p className="text-sm">คอลัมน์ที่จำเป็น:</p>
            <div className="mt-2 flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {ALUMNI_DATA_HEADER_COLUNM.map((s) => (
                <p
                  key={uuid()}
                  className="p-1 px-2 text-xs shadow-xs font-bold rounded-full bg-blue-100 text-blue-500"
                >
                  {s}
                </p>
              ))}
            </div>
            <p className="mt-3.5 text-sm text-gray-500">
              *โปรดปรับคอลัมน์ของไฟล์เพื่อให้ตรงกับคอลัมน์ของฐานข้อมูล
              ทุกคอลัมน์มีชนิดข้อมูลเป็นข้อความ (String/Text) ทั้งหมด
            </p>
            <p className="text-sm mt-2">ความหมาย:</p>
            <div className="mt-2 flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {ALUMNI_DATA_HEADER_MEAN.map((s) => (
                <p
                  key={uuid()}
                  className="p-1 px-2 text-xs shadow-xs font-bold rounded-full bg-gray-100 text-gray-500"
                >
                  {s}
                </p>
              ))}
            </div>
            <p className="text-sm mt-2">ตัวอย่างข้อมูล:</p>
            <div className="mt-2 w-full flex items-center flex-wrap gap-2">
              <ViewAlumniData />
              <ViewFaculty />
              <ViewDepartment />
              <ViewEduLevel />
            </div>
          </div>
        </div>
      </Modal>

      <LoadingWithProgess
        isOpen={importing}
        loadingText={"กำลังนำเข้าข้อมูล.... ระบบจะตรวจสอบข้อมูลซ้ำโดยอัตโนมัติ"}
        remark={"ระบบจะไม่บันทึกข้อมูลรหัสนักศึกษาที่มีอยู่แล้ว"}
        percent={progress}
      />
    </>
  );
};
export default ImportAlumniData;
