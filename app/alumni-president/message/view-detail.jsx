import Modal from "@/components/modal";
import {
  Calendar,
  Eye,
  FolderOpen,
  GraduationCap,
  Loader2,
  Mail,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { displaySenderName } from "./page";
import { DateTHFormat } from "@/libs/thai-local-formate-date";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { departmentText, facultyText } from "@/components/faculty-p";
import { useFacultyDep } from "@/hook/useFacultyDep";

const ViewDetail = ({ sendText }) => {
  const { faculties, departments } = useFacultyDep();
  const [showModal, setShowModal] = useState(false);
  const [alumniList, setAlumniList] = useState([]);
  const [load, setLoad] = useState(true);
  const getAlumniList = async () => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI +
          `/president/get-alumni-from-sendtext/${sendText?.id}`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        setAlumniList(res.data);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    if (!showModal) return;
    getAlumniList();
  }, [showModal]);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:text-white hover:bg-linear-90 hover:from-blue-600 hover:to-sky-300 px-3 rounded-lg flex items-center gap-2 text-sm"
      >
        <Eye size={18} />
        <p>ดูรายละเอียด</p>
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="w-full lg:w-1/3 rounded-lg bg-white flex flex-col z-50 overflow-auto">
          <div className="w-full flex items-center justify-between p-5">
            <div className="flex flex-col">
              <span className="flex items-center gap-2 text-blue-500">
                <Mail />
                <p className="text-lg font-semibold">รายละเอียด</p>
              </span>
              <p className="text-sm text-gray-700">รายละเอียดการส่งข้อความ</p>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <div className="p-5 border-t border-gray-300 w-full flex flex-col h-[600px] overflow-auto">
            <p className="font-semibold text-xl">{sendText?.title}</p>
            <div className="mt-1 w-full flex items-center gap-2.5 pb-3.5 border-b border-gray-300">
              {sendText?.category?.split(",")?.map((c, index) => (
                <p
                  key={index}
                  className="p-0.5 mt-1.5 w-fit px-2.5 text-xs rounded-full bg-blue-50 border border-blue-300 text-blue-500 font-semibold"
                >
                  {c}
                </p>
              ))}
            </div>
            <div className="mt-3.5 w-full grid grid-cols-2 gap-3.5 pb-3.5 border-b border-gray-300">
              <div className="flex items-start gap-3">
                <p className="p-1.5 rounded-lg shadow-xs bg-blue-100 text-blue-500">
                  <User size={18} />
                </p>
                <span className="flex flex-col">
                  <p className="text-xs text-gray-700">ผู้ส่ง</p>
                  <p>
                    {displaySenderName(sendText?.sender_type, sendText).name}
                  </p>
                  <p className="text-xs text-gray-700">
                    {" "}
                    {displaySenderName(sendText?.sender_type, sendText).type}
                  </p>
                </span>
              </div>
              <div className="flex items-start gap-5">
                <p className="p-1.5 rounded-lg shadow-xs bg-blue-100 text-blue-500">
                  <Calendar size={18} />
                </p>
                <span className="flex flex-col">
                  <p className="text-xs text-gray-700">วันเวลาที่ส่ง</p>
                  <p>{DateTHFormat(sendText?.createdAt)}</p>
                  <p className="text-xs text-gray-700">
                    {" "}
                    {new Date(sendText?.createdAt).toLocaleTimeString("th-TH")}
                  </p>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <p className="p-1.5 rounded-lg shadow-xs bg-blue-100 text-blue-500">
                  <GraduationCap size={18} />
                </p>
                <span className="flex flex-col">
                  <p className="text-xs text-gray-700">ผู้รับ</p>
                  <p>
                    {sendText?.alumniId?.split(",").length?.toLocaleString() ||
                      0}
                  </p>
                </span>
              </div>
            </div>
            <p className="mt-3.5 text-sm text-gray-700">เนื้อหาอีเมล</p>
            <div
              className="mt-1.5 w-full p-2 rounded-lg h-40 pb-3.5 border-b border-b-gray-300 overflow-auto bg-gray-50 border border-gray-100 shadow-xs"
              dangerouslySetInnerHTML={{
                __html: sendText?.detail,
              }}
            ></div>

            <p className="mt-3.5 pt-3.5 border-t border-gray-300 text-sm text-gray-700">
              รายชื่อผู้รับ ({" "}
              {sendText?.alumniId?.split(",").length?.toLocaleString() || 0} คน)
            </p>
            <div className="w-full mt-1.5 h-40 overflow-auto flex flex-col">
              {load ? (
                <div className="w-full flex flex-col items-center py-24 text-sm gap-2">
                  <Loader2 className="animate-spin text-blue-500" size={35} />
                  <p>กำลังโหลด...</p>
                </div>
              ) : alumniList.length < 1 ? (
                <div className="w-full text-gray-700 flex flex-col items-center py-24 gap-2">
                  <FolderOpen size={35} />
                  <p>ไม่พบข้อมูล</p>
                </div>
              ) : (
                alumniList.map((d, index) => (
                  <div className="flex flex-col p-2.5 border-b border-gray-300 hover:bg-gray-50" key={index}>
                    <p>
                      {d?.prefix || ""}
                      {d?.fname} {d?.lname} ({d?.alumni_id})
                    </p>
                    <p className="text-xs text-gray-700">
                      {facultyText(faculties, d?.facultyId)}-
                      {departmentText(departments, d?.departmentId)}
                    </p>
                    <span className="flex items-center gap-1 text-xs mt-1">
                      <Calendar size={15} className="text-blue-400" />
                      <p className="text-gray-700">
                        ปีการศึกษา {d?.year_start} - {d?.year_end}
                      </p>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ViewDetail;
