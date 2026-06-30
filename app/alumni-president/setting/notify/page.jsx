"use client";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import { isValidEmail } from "@/libs/validate";
import axios from "axios";
import { Bell, Check, Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import ReactSwitch from "react-switch";

const NotifySetting = () => {
  const [allowedSetting, setAllowedSetting] = useState({
    allowedNotifyAlumniRegis: true,
    allowedNotifyAlumniEditRegis: true,
  });

  const handleToggleSwitch = (key, checked) => {
    setAllowedSetting((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const [mail, setMail] = useState("");
  const [id, setId] = useState("");
  const [load, setLoad] = useState(true);
  const getData = async () => {
    setLoad(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-setting-data",
        { withCredentials: true },
      );
      if (res.status === 200) {
        setId(res?.data?.id);
        setMail(res?.data?.notify_email);
        setAllowedSetting({ ...res?.data });
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

  const handleSaveMail = async () => {
    if (!isValidEmail(mail)) return alerts.warning("รูปแบบอีเมลไม่ถูกต้อง");
    setLoad(true);
    try {
      const res = await axios.put(
        apiConfig.rmuAPI + `/president/update-setting-notify-mail/${id}`,
        { notify_email: mail },
        { withCredentials: true },
      );
      if (res.status === 200) {
        alerts.success();
        getData();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };

  const handleSaveToggle = async () => {
    setLoad(true);
    try {
      const res = await axios.put(
        apiConfig.rmuAPI + `/president/update-setting-account/${id}`,
        allowedSetting,
        { withCredentials: true },
      );
      if (res.status === 200) {
        alerts.success();
        getData();
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
      <div className="w-full mt-5 shadow-sm rounded-lg bg-white">
        <div className="w-full p-3.5 rounded-tl-lg rounded-tr-lg border border-gray-200 flex flex-col">
          <span className="flex items-center gap-3.5">
            <p className="p-2.5 rounded-lg bg-blue-100 text-blue-600 w-fit">
              <Mail />
            </p>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold">ตั้งค่าอีเมล</p>
              <p className="text-xs text-gray-700">
                กรอกอีเมลที่ต้องการรับการแจ้งเตือน
              </p>
            </div>
          </span>
        </div>
        <div className="w-full p-5 text-sm rounded-b-lg border border-gray-200 border-t-0 flex flex-col">
          <p>อีเมลสำหรับรับการแจ้งเตือน</p>
          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            className="w-full md:w-1/2 lg:w-2/3 focus:border-blue-500 p-2 px-3 rounded-lg text-sm border border-gray-300 mt-1.5 shadow-sm"
            placeholder="เช่น alumniRMU@rmu.ac.th"
          />
          <button
            disabled={load}
            onClick={handleSaveMail}
            className="p-2 px-3 w-fit mt-3.5 text-sm rounded-lg flex items-center gap-2 shadow-sm bg-blue-500 hover:bg-blue-600 text-white"
          >
            {load ? (
              <>
                <Loader2 className="animate-spin" />
                <p>กำลังโหลด...</p>
              </>
            ) : (
              <>
                {" "}
                <Check size={18} />
                <p>บันทึก</p>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="w-full mt-5 shadow-sm rounded-lg bg-white">
        <div className="w-full p-3.5 rounded-tl-lg rounded-tr-lg border border-gray-200 flex flex-col">
          <span className="flex items-center gap-3.5">
            <p className="p-2.5 rounded-lg bg-blue-100 text-blue-600 w-fit">
              <Bell />
            </p>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold">การแจ้งเตือน</p>
              <p className="text-xs text-gray-700">
                ตั้งค่ารับการแจ้งเตือนทางอีเมล
              </p>
            </div>
          </span>
        </div>
        <div className="w-full p-5 text-sm rounded-b-lg border border-gray-200 border-t-0 flex flex-col gap-3">
          <div className="w-full p-3.5 text-sm rounded-lg border border-gray-100 bg-gray-50 shadow-sm flex items-center justify-between">
            <span className="flex flex-col gap-0.5">
              <p>รับการแจ้งเตือนเมื่อศิษย์เก่าลงทะเบียน</p>
              <p className="text-xs text-gray-700">
                รับการแจ้งเตือนทางอีเมลเมื่อศิษย์เก่าชำระการลงทะเบียนบัณฑิต
              </p>
            </span>
            <ReactSwitch
              checked={allowedSetting.allowedNotifyAlumniRegis}
              onChange={() =>
                handleToggleSwitch(
                  "allowedNotifyAlumniRegis",
                  !allowedSetting.allowedNotifyAlumniRegis,
                )
              }
              className="cursor-not-allowed"
            />
          </div>
          <div className="w-full p-3.5 text-sm rounded-lg border border-gray-100 bg-gray-50 shadow-sm flex items-center justify-between">
            <span className="flex flex-col gap-0.5">
              <p>รับการแจ้งเตือนเมื่อศิษย์เก่าแก้ไขการลงทะเบียน</p>
              <p className="text-xs text-gray-700">
                รับการแจ้งเตือนทางอีเมลเมื่อศิษย์เก่าแก้ไขหลักฐานการชำระการลงทะเบียนบัณฑิต
              </p>
            </span>
            <ReactSwitch
              checked={allowedSetting.allowedNotifyAlumniEditRegis}
              onChange={() =>
                handleToggleSwitch(
                  "allowedNotifyAlumniEditRegis",
                  !allowedSetting.allowedNotifyAlumniEditRegis,
                )
              }
              className="cursor-not-allowed"
            />
          </div>

          <button
            disabled={load}
            onClick={handleSaveToggle}
            className="p-2 px-3 w-fit mt-3.5 text-sm rounded-lg flex items-center gap-2 shadow-sm bg-blue-500 hover:bg-blue-600 text-white"
          >
            {load ? (
              <>
                <Loader2 className="animate-spin" />
                <p>กำลังโหลด...</p>
              </>
            ) : (
              <>
                {" "}
                <Check size={18} />
                <p>บันทึก</p>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};
export default NotifySetting;
