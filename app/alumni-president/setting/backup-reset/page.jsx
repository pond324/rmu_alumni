"use client";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  GraduationCap,
  UserRound,
  Users,
  Briefcase,
  School,
  Shield,
  Mail,
  Newspaper,
  Database,
  FileSpreadsheet,
  Check,
  Cloud,
  Loader2,
  Computer,
  AlertCircle,
  AlertTriangle,
  Trash2,
  File,
} from "lucide-react";
import { FaGoogleDrive } from "react-icons/fa";
import DeleteBtn from "./delete-btn";

export const BACKUP_DATA_TABLES = [
  {
    icon: <GraduationCap size={18} />,
    title: "ศิษย์เก่า",
    des: "ข้อมูลศิษย์เก่าทั้งหมด",
    model: "alumni",
  },
  {
    icon: <UserRound size={18} />,
    title: "ข้อมูลการลงทะเบียนศิษย์เก่า",
    des: "ข้อมูลคำขอสมัครสมาชิกศิษย์เก่า",
    model: "regis_alumni",
  },
  {
    icon: <Users size={18} />,
    title: "บุคลากร",
    des: "ข้อมูลอาจารย์และบุคลากรทั้งหมด",
    model: "professor",
  },
  {
    icon: <Shield size={18} />,
    title: "ผู้ดูแลระบบ",
    des: "ข้อมูลผู้ดูแลระบบ",
    model: "admin",
  },
  {
    icon: <Mail size={18} />,
    title: "ประวัติการส่งข้อความ",
    des: "ข้อมูลการส่งข้อความและอีเมล",
    model: "sendTextHistory",
  },
  {
    icon: <Briefcase size={18} />,
    title: "ประวัติการทำงาน",
    des: "ข้อมูลประสบการณ์การทำงานของศิษย์เก่า",
    model: "work_expreriences",
  },
  {
    icon: <School size={18} />,
    title: "ประวัติการศึกษา",
    des: "ข้อมูลการศึกษาต่อของศิษย์เก่า",
    model: "studey_expreriences",
  },
  {
    icon: <UserRound size={18} />,
    title: "ข้อมูลติดต่อ",
    des: "ข้อมูลการติดต่อของศิษย์เก่าและบุคลากร",
    model: "alumni_contract",
  },
  {
    icon: <Shield size={18} />,
    title: "การตั้งค่าความเป็นส่วนตัว",
    des: "ข้อมูลสิทธิ์การมองเห็นข้อมูลของศิษย์เก่าและบุคาลกร",
    model: "user_privacy",
  },
  {
    icon: <Newspaper size={18} />,
    title: "ข่าวและกิจกรรม",
    des: "ข้อมูลข่าวสารและการบริจาค",
    model: "news_donatios",
  },
  {
    icon: <FileSpreadsheet size={18} />,
    title: "ประวัติการนำเข้าข้อมูล",
    des: "ข้อมูลการ Import ไฟล์เข้าสู่ระบบ",
    model: "import_history",
  },
];

const BackupReset = () => {
  const [folderId, setFolderId] = useState("");
  const [fileFolderId, setFileFolderId] = useState("");
  const [id, setId] = useState(null);
  const [load, setLoad] = useState(false);
  const getData = async () => {
    setLoad(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-setting-data",
        { withCredentials: true },
      );
      if (res?.data?.err) {
        return alerts.warning(res?.data?.err);
      }
      if (res.status === 200) {
        setId(res?.data?.id);
        setFolderId(res?.data?.backup_folderid || "");
        setFileFolderId(res?.data?.filebackup_folderid || "");
        // console.log("🚀 ~ getData ~ res?.data:", res?.data);
        // console.log("🚀 ~ getData ~ ...res?.data:", ...res?.data)
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

  const [uploading, setUploading] = useState(false);
  const handleSaveFolderId = async () => {
    if (!folderId) return alerts.warning("กรุณาใส่ Folder ID");
    try {
      setUploading(true);
      const res = await axios.post(
        apiConfig.rmuAPI + `/president/check-drive-backup-verify/${id}`,
        { backup_folderid: folderId },
        { withCredentials: true },
      );
      if (res?.data?.err) {
        return alerts.warning(res?.data?.err);
      }
      if (res.status === 200) {
        alerts.success();
        getData();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setUploading(false);
    }
  };
  const handleSaveFileFolderId = async () => {
    if (!folderId) return alerts.warning("กรุณาใส่ Folder ID");
    try {
      setUploading(true);
      const res = await axios.post(
        apiConfig.rmuAPI + `/president/check-drive-filebackup-verify/${id}`,
        { filebackup_folderid: fileFolderId },
        { withCredentials: true },
      );
      if (res?.data?.err) {
        return alerts.warning(res?.data?.err);
      }
      if (res.status === 200) {
        alerts.success();
        getData();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setUploading(false);
    }
  };

  const [processing, setProcessing] = useState(null);
  const handleBackUp = async (model, toDrive) => {
    try {
      setProcessing(model);
      const res = await axios.post(
        apiConfig.rmuAPI + `/president/backup-data`,
        { model, toDrive },
        { withCredentials: true },
      );
      if (res.data.err) {
        return alerts.err(res?.data?.err);
      }
      if (res.status === 200) {
        const data = res.data;
        if (!toDrive) {
          if (!data) {
            return alerts.err("ไม่พบข้อมูลที่ต้องการ export");
          }
          // แปลง JSON → Worksheet
          const worksheet = XLSX.utils.json_to_sheet(data);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

          // เขียนไฟล์เป็น binary
          const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
          });

          // บันทึกไฟล์
          const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
          });
          saveAs(blob, `backup_${model}_${Date.now()}.xlsx`);
        }
        alerts.success("สำรองข้อมูลแล้ว");
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setProcessing(null);
    }
  };

  const handleBackupFiles = async (model, toDrive) => {
    try {
      setProcessing(model);
      const res = await axios.post(
        apiConfig.rmuAPI + `/president/backup-files`,
        { model, toDrive },
        {
          withCredentials: true,
          ...(!toDrive && {
            responseType: "blob",
          }),
        },
      );
      if (res.data.err) {
        return alerts.err(res?.data?.err);
      }
      if (res.status === 200) {
        if (!toDrive) {
          const url = window.URL.createObjectURL(new Blob([res.data]));

          const link = document.createElement("a");

          link.href = url;
          link.setAttribute("download", "alumnisystembackupfiles.zip");

          document.body.appendChild(link);

          link.click();

          link.remove();

          window.URL.revokeObjectURL(url);
        }
        alerts.success(
          toDrive
            ? "ระบบได้เริ่มทำการบันทึกไฟล์แล้ รอ 5 - 10 นาที จากนั้นตรวจสอบที่โฟลเดอร์ที่คุณได้เชื่อมต่อไว้กับระบบ"
            : "ดาวน์โหลดไฟล์ทั้งหมดเป็นโฟลเดอร์ .zip แล้ว",
        );
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setProcessing(null);
    }
  };

  return (
    <>
      <div className="w-full mt-5 shadow-sm rounded-lg bg-white">
        <div className="w-full p-3.5 rounded-tl-lg rounded-tr-lg border border-gray-200 flex flex-col">
          <span className="flex items-center gap-3.5">
            <p className="p-2.5 rounded-lg bg-blue-100 text-blue-600 w-fit">
              <Cloud />
            </p>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold">เชื่อมต่อ Google Drive</p>
              <p className="text-xs text-gray-700">
                ไฟล์สำรองจะถูกอัปโหลดไปยัง Google Drive ตามโฟลเดอร์ที่กำหนด
              </p>
            </div>
          </span>
        </div>
        <div className="w-full p-5 rounded-b-lg border border-gray-200 border-t-0 flex flex-col ">
          <div className="p-2.5 bg-gray-50 border rounded-lg border-gray-300 flex flex-col text-sm">
            <p>วิธีการตั้งค่า</p>
            <p className="text-xs text-gray-700 my-0.5">
              1. เปิด Google Drive แล้วสร้างหรือเลือกโฟลเดอร์ที่ต้องการใช้เก็บ
              Backup
            </p>
            <p className="text-xs text-gray-700 my-0.5">
              2. คลิกขวาที่โฟลเดอร์ → Share → วางอีเมลนี้:{" "}
              <span className="font-mono text-gray-900 select-all">
                alumnisystem-backup-service@powerful-lore-500507-h9.iam.gserviceaccount.com
              </span>
            </p>
            <p className="text-xs text-gray-700 my-0.5">
              3. เลือกสิทธิ์เป็น <span className="font-medium">Editor</span>{" "}
              แล้วกด Send (ไม่ต้องติ๊ก Notify people ก็ได้)
            </p>
            <p className="text-xs text-gray-700 my-0.5">
              4. คัดลอก Folder ID จาก URL ของโฟลเดอร์ (ส่วนหลัง /folders/)
              มาวางด้านล่าง
            </p>
          </div>
          <div className="mt-3 w-full grid lg:grid-cols-2 gap-5">
            <div className="flex flex-col">
              {" "}
              <p className="mt-3">
                Folder ID <small>(สำหรับสำรองข้อมูล)</small>
              </p>
              <input
                type="text"
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full md:w-1/2 lg:w-2/3 focus:border-blue-500 p-2 px-3 rounded-lg text-sm border border-gray-300 mt-1.5 shadow-sm"
                placeholder="เช่น 1JVl46ETZAWnrbI7vxpBpEcIL_rSrYNw6"
              />
              <div className="mt-2 flex items-center gap-2">
                <button
                  disabled={uploading}
                  onClick={handleSaveFolderId}
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
                      <p>ตรวจสอบและบันทึก</p>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              {" "}
              <p className="mt-3">
                Folder ID <small>(สำหรับสำรองไฟล์รูปภาพและเอกสารอื่นๆ)</small>
              </p>
              <input
                type="text"
                value={fileFolderId}
                onChange={(e) => setFileFolderId(e.target.value)}
                className="w-full md:w-1/2 lg:w-2/3 focus:border-blue-500 p-2 px-3 rounded-lg text-sm border border-gray-300 mt-1.5 shadow-sm"
                placeholder="เช่น 1JVl46ETZAWnrbI7vxpBpEcIL_rSrYNw6"
              />
              <div className="mt-2 flex items-center gap-2">
                <button
                  disabled={uploading}
                  onClick={handleSaveFileFolderId}
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
                      <p>ตรวจสอบและบันทึก</p>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-5 shadow-sm rounded-lg bg-white">
        <div className="w-full p-3.5 rounded-tl-lg rounded-tr-lg border border-gray-200 flex flex-col">
          <span className="flex items-center gap-3.5">
            <p className="p-2.5 rounded-lg bg-blue-100 text-blue-600 w-fit">
              <Database />
            </p>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold">
                เลือกข้อมูลที่ต้องการสำรอง
              </p>
              <p className="text-xs text-gray-700">
                ระบบจะ export เป็นไฟล์ Excel (.xlsx) และอัปโหลดไปยัง Google
                Drive
              </p>
            </div>
          </span>
        </div>
        <div className="w-full p-5 rounded-b-lg border border-gray-200 border-t-0 grid lg:grid-cols-2 gap-3.5">
          {BACKUP_DATA_TABLES.map((b, index) => (
            <div
              key={index}
              className="p-3.5 rounded-lg bg-white shadow-sm border border-gray-100 flex items-start gap-3.5"
            >
              <p className="p-2 rounded-lg bg-blue-50 text-blue-500 shadow-sm">
                {b?.icon}
              </p>

              <div className="flex text-sm flex-col gap-0.5">
                <p>{b?.title}</p>
                <p className="text-xs text-gray-700">{b?.des}</p>
                <span className="flex items-center gap-2">
                  <button
                    disabled={processing}
                    onClick={() => handleBackUp(b.model, false)}
                    className="p-2 px-3 rounded-lg mt-1.5 text-xs text-gray-600 hover:text-black bg-gray-50 hover:bg-bgray-100 border border-gray-300 flex items-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="animate-spin" />
                        <p>
                          {processing !== b.model
                            ? "มีรายการอื่นกำลังดำเนินการขณะนี้..."
                            : "กำลังดำเนินการ..."}
                        </p>
                      </>
                    ) : (
                      <>
                        {" "}
                        <Computer size={18} />
                        <p>ดาวน์โหลดลงเครื่อง</p>
                      </>
                    )}
                  </button>
                  <button
                    disabled={processing}
                    onClick={() => handleBackUp(b.model, true)}
                    className="p-2 px-3 rounded-lg mt-1.5 text-xs text-white  bg-blue-500 hover:bg-blue-600 border border-blue-300 flex items-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="animate-spin" />
                        <p>
                          {processing !== b.model
                            ? "มีรายการอื่นกำลังดำเนินการขณะนี้..."
                            : "กำลังดำเนินการ..."}
                        </p>
                      </>
                    ) : (
                      <>
                        <FaGoogleDrive size={18} />
                        <p>สำรองไปยัง GoogleDrive</p>
                      </>
                    )}
                  </button>
                </span>
              </div>
            </div>
          ))}
          <div className="p-3.5 rounded-lg bg-white shadow-sm border border-gray-100 flex items-start gap-3.5">
            <p className="p-2 rounded-lg bg-blue-50 text-blue-500 shadow-sm">
              <File size={18} />
            </p>

            <div className="flex text-sm flex-col gap-0.5">
              <p>ไฟล์ทั้งหมด</p>
              <p className="text-xs text-gray-700">
                ไฟล์รูปภาพและไฟล์อื่นๆที่เกี่ยวข้อง
              </p>
              <span className="flex items-center gap-2">
                <button
                  disabled={processing}
                  onClick={() => handleBackupFiles("files", false)}
                  className="p-2 px-3 rounded-lg mt-1.5 text-xs text-gray-600 hover:text-black bg-gray-50 hover:bg-bgray-100 border border-gray-300 flex items-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="animate-spin" />
                      <p>
                        {processing !== "files"
                          ? "มีรายการอื่นกำลังดำเนินการขณะนี้..."
                          : "กำลังดำเนินการ...อาจใช้เวลนาน"}
                      </p>
                    </>
                  ) : (
                    <>
                      {" "}
                      <Computer size={18} />
                      <p>ดาวน์โหลดลงเครื่อง</p>
                    </>
                  )}
                </button>
                <button
                  disabled={processing}
                  onClick={() => handleBackupFiles("files", true)}
                  className="p-2 px-3 rounded-lg mt-1.5 text-xs text-white  bg-blue-500 hover:bg-blue-600 border border-blue-300 flex items-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="animate-spin" />
                      <p>
                        {processing !== "files"
                          ? "มีรายการอื่นกำลังดำเนินการขณะนี้..."
                          : "กำลังดำเนินการ...อาจใช้เวลนาน"}
                      </p>
                    </>
                  ) : (
                    <>
                      <FaGoogleDrive size={18} />
                      <p>สำรองไปยัง GoogleDrive</p>
                    </>
                  )}
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-5 shadow-sm rounded-lg bg-white">
        <div className="w-full p-3.5 rounded-tl-lg rounded-tr-lg border border-gray-200 flex flex-col">
          <span className="flex items-center gap-3.5">
            <p className="p-2.5 rounded-lg bg-red-100 text-red-600 w-fit">
              <AlertTriangle />
            </p>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-red-500">รีเซ็ตข้อมูล</p>
              <p className="text-xs text-gray-700">
                ล้างข้อมูลที่เลือก — การกระทำนี้ไม่สามารถย้อนกลับได้
                ควรสำรองข้อมูลก่อนทุกครั้ง
              </p>
            </div>
          </span>
        </div>
        <div className="w-full p-5 rounded-b-lg border border-gray-200 border-t-0 flex flex-col ">
          <div className="w-full rounded-lg border border-red-100 flex items-center gap-3 p-3.5 bg-red-50 text-red-500">
            <AlertCircle />
            <span className="text-sm font-semibold">คำเตือน</span>
            <p className="text-xs">
              การล้างข้อมูลจะลบเรกคอร์ดออกจากฐานข้อมูลถาวร
              แนะนำให้สำรองข้อมูลไปยัง Google Drive ก่อนทุกครั้ง
            </p>
          </div>
          <div className="mt-3 w-full grid lg:grid-cols-2 gap-3.5">
            {BACKUP_DATA_TABLES.map((b, index) => (
              <div
                key={index}
                className="p-3.5 rounded-lg bg-white shadow-sm border border-gray-100 flex items-start gap-3.5"
              >
                <p className="p-2 rounded-lg bg-red-50 text-red-500 shadow-sm">
                  {b?.icon}
                </p>

                <div className="flex text-sm flex-col gap-0.5">
                  <p>{b?.title}</p>
                  <p className="text-xs text-gray-700">{b?.des}</p>
                  <span className="flex items-center gap-2">
                    <DeleteBtn des={b.des} model={b.model} tile={b.title} />
                  </span>
                </div>
              </div>
            ))}
            <div className="p-3.5 rounded-lg bg-white shadow-sm border border-gray-100 flex items-start gap-3.5">
              <p className="p-2 rounded-lg bg-red-50 text-red-500 shadow-sm">
                <File size={18} />
              </p>

              <div className="flex text-sm flex-col gap-0.5">
                <p>ไฟล์ทั้งหมด</p>
                <p className="text-xs text-gray-700">
                  ไฟล์รูปภาพและไฟล์อื่นๆที่เกี่ยวข้อง
                </p>
                <span className="flex items-center gap-2">
                 <DeleteBtn des={"ไฟล์รูปภาพและไฟล์อื่นๆทั้งหมด"} model={"files"} tile={"ไฟล์"}/>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BackupReset;
