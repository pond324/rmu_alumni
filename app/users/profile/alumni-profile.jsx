"use client";
import {
  Book,
  Building2,
  Calendar,
  Loader2,
  Mail,
  Map,
  Save,
  Trash,
  University,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import LiveContact from "./live-contact";
import Contact from "./contact";
import useGetSession from "@/hook/useGetSeesion";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import Loading from "@/components/loading";
import { departmentText, facultyText } from "@/components/faculty-p";
import CurrentStatus from "./current-status";
import { useFacultyDep } from "@/hook/useFacultyDep";

export const NO_PROFILE_IMG =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const AlumniProfile = () => {
  const { user } = useGetSession();
  console.log("🚀 ~ AlumniProfile ~ user:", user);
  const { departments, faculties } = useFacultyDep();

  const [showMenuType, setShowMenuType] = useState(1);
  const [roleId, setRoleId] = useState(1);
  const [userData, setUserData] = useState();
  const [fileImage, setFileImage] = useState();
  const [loading, setLoading] = useState(true);

  const [profileImage, setProfileImage] = useState(NO_PROFILE_IMG);
  const [showImgMenu, setShowImgMenu] = useState(false);

  const handleProfileImage = (e) => {
    setShowImgMenu(true);
    const file = e.target.files[0];
    if (!file) {
      return setShowImgMenu(false);
    }
    setProfileImage(URL.createObjectURL(file));
    setFileImage(file);
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/alumni/profile", {
        withCredentials: true,
      });
      if (res?.status === 200) {
        setUserData(res?.data?.alumni);
        setProfileImage(
          res?.data?.alumni?.profile
            ? apiConfig.imgAPI + res?.data?.alumni?.profile
            : NO_PROFILE_IMG,
        );
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  const [changingImg, setChangingImg] = useState(false);
  const uploadImage = async () => {
    if (!fileImage) return;
    setChangingImg(true);
    try {
      const formData = new FormData();
      formData.append("file", fileImage);

      const res = await axios.post(
        apiConfig.rmuAPI + "/alumni/upload-profile",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (res?.data?.err) {
        return alerts.err(res?.data?.err);
      }

      if (res?.status === 200) {
        alerts.success("บันทึกรูปภาพแล้ว");
        fetchUserData();
        setShowImgMenu(false);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setChangingImg(false);
    }
  };

  const [deleting, setDeleting] = useState(false);
  const deleteProfile = async () => {
    const { isConfirmed } = await alerts.confirmDialog(
      "ลบรูปภาพ",
      "ต้องการลบรูปภาพหรือไม่?",
      "ลบ",
    );
    if (!isConfirmed) return;

    setDeleting(true);
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI + "/alumni/delete-profile",
        { withCredentials: true },
      );
      if (res?.data?.err) {
        return alerts.err(res?.data?.err);
      }
      if (res?.status === 200) {
        alerts.success("ลบรูปภาพแล้ว");
        fetchUserData();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    setRoleId(user?.roleId);
  }, [user]);

  if (loading)
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        <Loading type={2} />
        <p className="">กำลังโหลด...</p>
      </div>
    );

  return (
    <>
      <div className="w-full flex flex-col gap-5 p-5 lg:p-8 lg:px-10">
        <div className="w-full flex flex-col lg:gap-20 gap-5 lg:flex-row ">
          <div className="w-full md:w-1/4 flex flex-col items-center gap-2">
            <label
              className="w-full h-[220px] border border-gray-300 relative group rounded-sm shadow-sm overflow-hidden cursor-pointer transition-all duration-300"
              htmlFor="img-picker"
            >
              <span className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full bg-black/50 text-gray-50 opacity-0 group-hover:opacity-100 transition">
                เลือกรูปภาพ
              </span>

              <input
                onChange={handleProfileImage}
                type="file"
                id="img-picker"
                className="hidden"
              />

              <img
                src={profileImage}
                className="w-full h-full object-cover"
                alt=""
              />
            </label>

            <div className="flex items-center justify-end gap-2 w-full mt-2">
              {showImgMenu && (
                <button
                  disabled={changingImg}
                  onClick={uploadImage}
                  className="p-2 px-3 text-sm rounded-md border text-white bg-blue-500 border-blue-400 flex items-center gap-2"
                >
                  {changingImg ? (
                    <>
                      <Loader2
                        size={15}
                        color="white"
                        className="animate-spin"
                      />
                      <p>กำลังบันทึก...</p>
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      <p>บันทึกภาพ</p>
                    </>
                  )}
                </button>
              )}
              {profileImage !== NO_PROFILE_IMG && (
                <button
                  disabled={deleting}
                  onClick={deleteProfile}
                  className="p-2 px-3 text-sm rounded-md border bg-white border-gray-400 flex items-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <p>กำลังบันทึก...</p>
                    </>
                  ) : (
                    <>
                      <Trash size={15} />
                      <p>ล้าง</p>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="lg:w-[70%] w-full flex flex-col gap-0.5">
            <span className="flex items-center w-fit gap-2 text-sm pb-3 px-5 border-b-2 border-blue-500 text-blue-500">
              <User size={15} />
              <p>ทั่วไป</p>
            </span>
            <p className="text-lg lg:text-xl mt-3 text-gray-700 font-bold">
              {userData?.prefix}
              {userData?.fname} {userData?.lname}
            </p>
            {user?.roleId < 2 && (
              <>
                <p className="text-blue-500">{userData?.alumni_id}</p>{" "}
                <span className="mt-3.5 flex items-center gap-2.5 text-gray-700">
                  <Calendar size={18} color="blue" />
                  <p>
                    ปี พ.ศ. {userData?.year_start} - ปี พ.ศ.{" "}
                    {userData?.year_end || "ไม่พบข้อมูลปีที่สำเร็จการศึกษา"}
                  </p>
                </span>
              </>
            )}
            <div className="mt-3.5 flex lg:items-center gap-2.5 text-gray-700">
              <Building2 size={18} color="blue" />
              <span className="flex items-center flex-col md:flex-row gap-2.5">
                {" "}
                <p>{departmentText(departments, userData?.departmentId)}</p>
                <p>{facultyText(faculties, userData?.facultyId)}</p>
              </span>
            </div>
            {user?.roleId > 1 && (
              <>
                <div
                  className={`p-3.5 mt-2 w-full lg:w-1/2 text-sm rounded-lg shadow-xs ${user?.roleId < 4 ? "bg-blue-50 " : "bg-linear-90 from-amber-50 to-sky-150 "} flex flex-col gap-2`}
                >
                  <span className="flex text-gray-600 items-center gap-2">
                    <University size={16} /> <p>ตำแหน่ง</p>
                  </span>
                  <p className="text-blue-500">{user?.position}</p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="w-full relative flex flex-col-reverse lg:gap-20 gap-5 lg:flex-row ">
          {user?.roleId === 1 && <CurrentStatus />}
          <div className="w-full lg:w-[70%] flex-col">
            <div className="flex  items-center border-b-2 mb-5 border-gray-300 w-full">
              <button
                onClick={() => setShowMenuType(1)}
                className={`pb-3 flex items-center gap-2 text-sm px-5  ${showMenuType === 1 ? "border-b-2 text-blue-500 border-b-blue-500" : "text-gray-600"}`}
              >
                <Mail size={15} /> ช่องทางการติดต่อ
              </button>
              <button
                onClick={() => setShowMenuType(2)}
                className={`pb-3 flex items-center gap-2 text-sm px-5  ${showMenuType === 2 ? "border-b-2 text-blue-500 border-b-blue-500" : "text-gray-600"}`}
              >
                <Map size={15} />
                ที่อยู่
              </button>
            </div>
            {showMenuType === 1 ? <Contact /> : <LiveContact />}
          </div>
        </div>
      </div>
    </>
  );
};
export default AlumniProfile;
