import Modal from "@/components/modal";
import { useEffect, useState } from "react";
import { Eye, Image, Mail, User, X } from "lucide-react";
import { apiConfig } from "@/config/api.config";
import { NO_PROFILE_IMG } from "@/app/users/profile/alumni-profile";
import { formatPhoneNumber } from "@/libs/validate";
import { departmentText, facultyText } from "@/components/faculty-p";
import { useFacultyDep } from "@/hook/useFacultyDep";
import DeleteContractBtn from "./delete-contract-btn";
import Loading from "@/components/loading";
import axios from "axios";
import { alerts } from "@/libs/alerts";

const ViewProfessorDataBtn = ({ user_id, fetchData }) => {
  const { departments, faculties } = useFacultyDep();
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [fetchUser, setFetchUser] = useState(true);
  const handleSeeUserData = async () => {
    setShowModal(true);
    setFetchUser(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + `/alumni/user/${user_id}/2`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        setUserData(res.data);
        // console.log("🚀 ~ handleSeeUserData ~ res.data:", res.data)
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setFetchUser(false);
    }
  };

  useEffect(() => {
    if (!showModal) return;
    handleSeeUserData();
  }, [showModal]);
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 px-3 rounded-lg flex items-center gap-2 text-sm hover:text-white hover:bg-linear-90 hover:from-blue-600 hover:to-sky-300"
      >
        <Eye size={18} />
        <p>ข้อมูลบุคลากร</p>
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="p-5 px-8 z-50 h-[600px] overflow-auto rounded-lg bg-white shadow-md w-full lg:w-3/4 flex flex-col">
          {fetchUser ? (
            <div className="w-full h-full gap-1 flex flex-col items-center justify-center">
              <Loading type={2} />
              <p>กำลังโหลด...</p>
            </div>
          ) : (
            <>
              <span className="w-full flex items-center justify-between pb-3 border-b border-gray-300">
                <p className="text-lg font-bold">ข้อมูลบุคลากร</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-md"
                >
                  <X size={20} />
                </button>
              </span>

              <div className="flex flex-col gap-8 lg:flex-row lg:items-start items-center mt-5">
                {/* profile img */}
                <div className="lg:w-[25%] w-full flex flex-col items-center">
                  <span className="flex items-center gap-2 w-full">
                    <Image size={18} className="text-blue-500" />
                    <p className="text-sm">รูปโปรไฟล์</p>
                  </span>
                  <div className="mt-2.5 w-[250px] h-[200px] rounded-lg border border-gray-300 shadow-sm">
                    <img
                      src={
                        userData?.profile
                          ? apiConfig.imgAPI + userData?.profile
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
                      <User size={18} className="text-blue-500" />
                      <p className="text-sm">ข้อมูลทั่วไป</p>
                    </span>
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-3 mt-3">
                      {/* fullname */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">ชื่อ-นามสกุล</p>
                        <p className="text-sm">
                          {userData?.univercity_position === "อาจารย์"
                            ? userData?.prefix
                            : userData?.academic_rank}
                          {userData?.fname} {userData?.lname}
                        </p>
                      </span>
                      {/* id */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">รหัสประจำตัว</p>
                        <p className="text-sm">{userData?.professor_id}</p>
                      </span>
                      {/* faculty */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">คณะ</p>
                        <p className="text-sm">
                          {facultyText(faculties, userData?.facultyId)}
                        </p>
                      </span>
                      {/* dep */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">สาขาวิชา</p>
                        <p className="text-sm">
                          {departmentText(departments, userData?.departmentId)}
                        </p>
                      </span>
                      <span className="flex flex-col  p-2 bg-gradient-to-r from-yellow-50 via-green-50 to-blue-50 rounded-md">
                        <p className="text-sm text-blue-600">ตำแหน่ง</p>
                        <p className="text-sm">
                          {userData?.univercity_position === "อาจารย์"
                            ? "อาจารย์ประจำสาจา"
                            : userData?.univercity_position}
                        </p>
                      </span>
                    </div>
                  </div>
                  {/* contract */}
                  <div className="flex flex-col items-end mt-3 pb-3 border-b border-gray-200">
                    <span className="flex items-center gap-2 w-full">
                      <Mail size={18} className="text-blue-500" />
                      <p className="text-sm">ช่องทางการติดต่อ</p>
                    </span>

                    <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-3 mt-3">
                      {/* emaiil1 */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-red-600">อีเมล</p>
                        <p className="text-sm">
                          {userData?.email1 || "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* email2 */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-red-600">อีเมล</p>
                        <p className="text-sm">
                          {userData?.email2 || "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* tel1 */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-green-600">เบอร์โทรศัพท์</p>
                        <p className="text-sm">
                          {userData?.phone1
                            ? formatPhoneNumber(userData?.phone1)
                            : "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* tel2 */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-green-600">เบอร์โทรศัพท์</p>
                        <p className="text-sm">
                          {" "}
                          {userData?.phone2
                            ? formatPhoneNumber(userData?.phone2)
                            : "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* facebook */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">facebook</p>
                        <p className="text-sm">
                          {userData?.facebook || "ไม่ระบุ"}
                        </p>
                      </span>
                      {/* address */}
                      <span className="flex flex-col bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-blue-600">ที่อยู่</p>
                        <p className="text-sm">{`${userData?.address || ""} ${
                          userData?.tambon ? "ตำบล" + userData?.tambon : ""
                        } ${
                          userData?.amphure ? "อำเภอ" + userData?.amphure : ""
                        } ${
                          userData?.province
                            ? "จังหวัด" + userData?.province
                            : "ไม่ระบุ"
                        } ${userData?.zipcode || ""}`}</p>
                      </span>
                    </div>
                    <DeleteContractBtn
                      fetch={() => {
                        setShowModal(false);
                        fetchData();
                      }}
                      professorId={userData?.professor_id}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};
export default ViewProfessorDataBtn;
