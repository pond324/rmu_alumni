import Modal from "@/components/modal";
import { NO_PROFILE_IMG } from "@/app/users/profile/alumni-profile";
import WorkCard from "@/app/users/work-history/work-card";
import StudyCard from "@/app/users/work-history/study-card";
import { formatPhoneNumber } from "@/libs/validate";
import { useEffect, useState } from "react";
import {
  Briefcase,
  Eye,
  Image,
  Loader2,
  Mail,
  Trash2,
  User,
} from "lucide-react";
import { FaFolderOpen, FaTimes } from "react-icons/fa";
import Loading from "@/components/loading";
import { apiConfig } from "@/config/api.config";
import { departmentText, facultyText } from "@/components/faculty-p";
import { useFacultyDep } from "@/hook/useFacultyDep";
import axios from "axios";
import { alerts } from "@/libs/alerts";
import uuid from "@/libs/uuid";

const AlumniData = ({ alumniId }) => {
  const { faculties, departments } = useFacultyDep();
  const [showModal, setShowModal] = useState(false);
  const [fetchAlumni, setFetchAlumni] = useState(false);
  const [alumniData, setAlumniData] = useState(null);
  const [showModalReason, setShowModalReason] = useState(false);
  const [isDeleteContract, setIsDeleteContract] = useState(true);
  const [reasonToDelete, setReasonToDelete] = useState("");
  const handleManageAlumni = async () => {
    setShowModal(true);
    setFetchAlumni(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + `/alumni/user/${alumniId}/1`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        setAlumniData(res.data);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setFetchAlumni(false);
    }
  };

  const handleDeleteContract = async () => {
    if (!reasonToDelete) {
      return alerts.err("โปรดระบุเหตุผล");
    }
    const { isConfirmed } = await alerts.confirmDialog(
      "ลบช่องทางการติดต่อของศิษย์เก่า",
      "ต้องการลบช่องทางการติดต่อทั้งหมดนี้หรือไม่?",
      "ลบ",
    );
    if (!isConfirmed) return;
    setFetchAlumni(true);
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI +
          `/president/delete-contract/${alumniData?.alumni_id}`,
        {
          withCredentials: true,
          params: {
            reasonToDelete,
          },
        },
      );
      if (res.data.err) {
        return alerts.err(res.data.err);
      }
      if (res.status === 200) {
        alerts.success("ลบช่องทางการติดต่อแล้ว");
        handleManageAlumni(alumniData?.alumni_id);
        setShowModalReason(false);
        setReasonToDelete("");
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setFetchAlumni(false);
    }
  };

  const handleDeleteWorkExprerience = async () => {
    if (!reasonToDelete) {
      return alerts.err("โปรดระบุเหตุผล");
    }
    const { isConfirmed } = await alerts.confirmDialog(
      "ลบประวัติของศิษย์เก่า",
      "ต้องการลบประวัติการทำงานและประวัติเข้าศึกษาต่อทั้งหมดหรือไม่?",
      "ลบ",
    );
    if (!isConfirmed) return;

    if (alumniData?.work_expreriences?.length < 1 && alumniData?.study_expreriences?.length < 1) {
      return alerts.err("ไม่พบประวัติการทำงานหรือประวัติการเข้าศึกษาต่อ");
    }
    setFetchAlumni(true);
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI + `/president/delete-work-ex/${alumniData?.alumni_id}`,
        {
          withCredentials: true,
          params: {
            reasonToDelete,
          },
        },
      );
      if (res.data.err) {
        return alerts.err(res.data.err);
      }
      if (res.status === 200) {
        alerts.success("ลบข้อมูลแล้ว");
        handleManageAlumni(alumniData?.alumni_id);
        setShowModalReason(false);
        setReasonToDelete("");
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setFetchAlumni(false);
    }
  };

  useEffect(() => {
    if (!showModal) return;
    handleManageAlumni();
  }, [showModal]);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 px-3 rounded-lg flex items-center text-sm gap-2 hover:bg-linear-90 from-blue-600 to-sky-300 hover:text-white"
      >
        <Eye size={18} />
        <p>ข้อมูลศิษย์เก่า</p>
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="p-5 px-8 z-99 h-[600px] overflow-auto rounded-lg bg-white shadow-md w-full lg:w-3/4 flex flex-col">
          {fetchAlumni ? (
            <div className="w-full h-full gap-1 flex flex-col items-center justify-center">
              <Loading type={2} />
              <p>กำลังโหลด...</p>
            </div>
          ) : (
            <>
              <span className="w-full flex items-center justify-between pb-3 border-b border-gray-300">
                <p className="text-lg font-bold">ข้อมูลศิษย์เก่า</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-md"
                >
                  <FaTimes size={20} />
                </button>
              </span>

              <div className="flex flex-col gap-8 lg:flex-row lg:items-start items-center mt-5">
                {/* profile img */}
                <div className="lg:w-[25%] w-full flex flex-col lg:items-start items-center">
                  <span className="flex items-center gap-2 w-full">
                    <Image className="text-blue-500" size={18} />
                    <p className="text-sm ">รูปโปรไฟล์</p>
                  </span>

                  <div className="mt-2.5 w-[250px] h-[200px] rounded-lg border border-gray-300 shadow-sm">
                    <img
                      src={
                        alumniData?.profile
                          ? apiConfig.imgAPI + alumniData?.profile
                          : NO_PROFILE_IMG
                      }
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                </div>
                {/* infomation */}
                <div className="lg:w-[75%] w-full lg:pl-8 lg:border-l border-gray-300">
                  {/* normal */}
                  <div className="flex flex-col pb-3 border-b border-gray-200">
                    <span className="flex items-center gap-2 w-full">
                      <User className="text-blue-500" size={18} />
                      <p className="text-sm ">ข้อมูลทั่วไป</p>
                    </span>
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-3 mt-3">
                      {/* fullname */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">ชื่อ-นามสกุล</p>
                        <p className="text-sm">
                          {alumniData?.prefix}
                          {alumniData?.fname} {alumniData?.lname}
                        </p>
                      </span>
                      {/* id */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">รหัสนักศึกษา</p>
                        <p className="text-sm">{alumniData?.alumni_id}</p>
                      </span>
                      {/* faculty */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">คณะ</p>
                        <p className="text-sm">
                          {facultyText(faculties, alumniData?.facultyId)}
                        </p>
                      </span>
                      {/* dep */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">สาขาวิชา</p>
                        <p className="text-sm">
                          {departmentText(
                            departments,
                            alumniData?.departmentId,
                          )}
                        </p>
                      </span>
                      {/* year */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">
                          ปีการศึกษา (พ.ศ.)
                        </p>
                        <p className="text-sm">
                          {alumniData?.year_start} - {alumniData?.year_end}
                        </p>
                      </span>
                    </div>
                  </div>
                  {/* contract */}
                  <div className="flex flex-col items-end mt-3 pb-3 border-b border-gray-200">
                    <span className="flex items-center gap-2 w-full">
                      <Mail className="text-blue-500" size={18} />
                      <p className="text-sm ">ช่องทางการติดต่อ</p>
                    </span>
                    <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-3 mt-3">
                      {/* emaiil1 */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-red-600">อีเมล</p>
                        <p className="text-sm">
                          {alumniData?.email1 || "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* email2 */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-red-600">อีเมล</p>
                        <p className="text-sm">
                          {alumniData?.email2 || "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* tel1 */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-green-600">เบอร์โทรศัพท์</p>
                        <p className="text-sm">
                          {alumniData?.phone1
                            ? formatPhoneNumber(alumniData?.phone1)
                            : "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* tel2 */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-green-600">เบอร์โทรศัพท์</p>
                        <p className="text-sm">
                          {" "}
                          {alumniData?.phone2
                            ? formatPhoneNumber(alumniData?.phone2)
                            : "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* facebook */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">facebook</p>
                        <p className="text-sm">
                          {alumniData?.facebook || "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* address */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">ที่อยู่</p>
                        <p className="text-sm">{`${alumniData?.address || ""} ${
                          alumniData?.tambon ? "ตำบล" + alumniData?.tambon : ""
                        } ${
                          alumniData?.amphure
                            ? "อำเภอ" + alumniData?.amphure
                            : ""
                        } ${
                          alumniData?.province
                            ? "จังหวัด" + alumniData?.province
                            : "ไม่ระบุ"
                        } ${alumniData?.zipcode || ""}`}</p>
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowModalReason(true);
                        setIsDeleteContract(true);
                      }}
                      className="p-2 px-3 mt-3 text-sm rounded-md hover:bg-red-600 bg-red-500 text-white flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      <p>ลบช่องทางการติดต่อ</p>
                    </button>
                  </div>
                  {/* ประวัติการทำงาน/การศึกษาต่อ */}
                  <div className="flex flex-col items-end mt-3 pb-3 border-b border-gray-200">
                    <span className="flex items-center gap-2 w-full">
                      <Briefcase className="text-blue-500" size={18} />
                      <p className="text-sm ">ประวัติ</p>
                    </span>
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3 h-[350px] overflow-auto">
                      {alumniData?.work_expreriences?.length > 0 ? (
                        alumniData?.work_expreriences.map((a) => {
                          return (
                            <WorkCard
                              key={uuid()}
                              e={a}
                              fetchWorkExprerience={() =>
                                handleManageAlumni(a?.alumni_id)
                              }
                            />
                          );
                        })
                      ) : (
                        <div className="lg:col-span-2 flex flex-col justify-center items-center py-10 gap-1 text-gray-600 text-sm">
                          <FaFolderOpen size={25} />
                          <p>ไม่พบประวัติการทำงาน</p>
                        </div>
                      )}
                      {alumniData?.study_expreriences?.length > 0 ? (
                        alumniData?.study_expreriences.map((a) => {
                          return (
                            <StudyCard
                              key={uuid()}
                              e={a}
                              fetchWorkExprerience={() =>
                                handleManageAlumni(a?.alumni_id)
                              }
                            />
                          );
                        })
                      ) : (
                        <div className="lg:col-span-2 flex flex-col justify-center items-center py-10 gap-1 text-gray-600 text-sm">
                          <FaFolderOpen size={25} />
                          <p>ไม่พบประวัติการเข้าศึกษาต่อ</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setShowModalReason(true);
                        setIsDeleteContract(false);
                      }}
                      className="p-2 px-3 mt-3 text-sm rounded-md hover:bg-red-600 bg-red-500 text-white flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      <p>ลบประวัติทั้งหมด</p>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
      {/* reason modal */}
      <Modal isOpen={showModalReason} onClose={() => setShowModalReason(false)}>
        <div className="w-full z-50 lg:w-1/3 p-5 shadow-md bg-white rounded-lg flex flex-col">
          <p className="font-semibold text-lg">กรุณาระบุเหตุผลในการลบ</p>
          <p className="text-sm">โปรดบอกเหตุผลที่ต้องลบข้อมูลนี้</p>
          <textarea
            value={reasonToDelete}
            onChange={(e) => setReasonToDelete(e.target.value)}
            className="w-full h-[150px] p-2.5 text-sm outline-none mt-2 border border-gray-300 resize-none shadow-xs rounded-md"
            placeholder="ระบุเหตุผลที่นี่..."
          ></textarea>
          <div className="mt-3 w-full justify-end flex items-end gap-2">
            <button
              disabled={fetchAlumni}
              onClick={() => {
                isDeleteContract
                  ? handleDeleteContract()
                  : handleDeleteWorkExprerience();
              }}
              className="p-2 px-3.5 bg-red-500 border border-red-300 flex items-center gap-2 text-white text-sm rounded-lg"
            >
              {fetchAlumni ? (
                <>
                  <Loader2 className="animate-spin" />
                  <p>กำลังลบ...</p>
                </>
              ) : (
                <>
                  {" "}
                  <Trash2 size={18} />
                  <p>ยืนยันลบ</p>
                </>
              )}
            </button>
            <button
              onClick={() => setShowModalReason(false)}
              className="p-2 px-3.5 border border-gray-300 shadow-xs  text-sm rounded-lg"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default AlumniData;
