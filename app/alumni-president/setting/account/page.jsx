"use client";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { Check, Database, Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";
import ReactSwitch from "react-switch";

const AccountSetting = () => {
  const [allowedSetting, setAllowedSetting] = useState({
    skipAlumniDuplicate: true,
    skipPersonelDuplicate: true,
    allowedAlumniAccount: true,
    allowedPersonelAccount: true,
    allowedAdminAccount: true,
  });

  const handleToggleSwitch = (key, checked) => {
    setAllowedSetting((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

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

  const handleSave = async () => {
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
              <Database />
            </p>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold">การจัดการนำเข้าข้อมูล</p>
              <p className="text-xs text-gray-700">
                ตั้งค่าการนำเข้าข้อมูลศิษย์เก่าและข้อมูลบุคคลากร
              </p>
            </div>
          </span>
        </div>
        <div className="w-full p-5 rounded-b-lg border border-gray-200 border-t-0 flex flex-col gap-3">
          <div className="w-full p-3.5 text-sm rounded-lg border border-gray-100 bg-gray-50 shadow-sm flex items-center justify-between">
            <span className="flex flex-col gap-0.5">
              <p>ข้ามข้อมูลศิษย์เก่าที่ซ้ำกัน</p>
              <p className="text-xs text-gray-700">
                ระบบจะไม่บันทึกข้อมูลศิษย์เก่าที่มีรหัสนักศึกษาอยู่แล้วในระบบ
                ลงในฐานข้อมูล
              </p>
            </span>
            <ReactSwitch
              disabled
              checked={allowedSetting.skipAlumniDuplicate}
              onChange={() =>
                handleToggleSwitch(
                  "skipAlumniDuplicate",
                  !allowedSetting.skipAlumniDuplicate,
                )
              }
              className="cursor-not-allowed"
            />
          </div>
          <div className="w-full p-3.5 text-sm rounded-lg border border-gray-100 bg-gray-50 shadow-sm flex items-center justify-between">
            <span className="flex flex-col gap-0.5">
              <p>ข้ามข้อมูลบุคลากรที่ซ้ำกัน</p>
              <p className="text-xs text-gray-700">
                ระบบจะไม่บันทึกข้อมูลอาจารย์/บุคลากรที่มีรหัสประจำตัวอยู่แล้วในระบบ
                ลงในฐานข้อมูล
              </p>
            </span>
            <div className="cursor-not-allowed">
              <ReactSwitch
                disabled
                checked={allowedSetting.skipPersonelDuplicate}
                onChange={() =>
                  handleToggleSwitch(
                    "skipPersonelDuplicate",
                    !allowedSetting.skipPersonelDuplicate,
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-5 shadow-sm rounded-lg bg-white">
        <div className="w-full p-3.5 rounded-tl-lg rounded-tr-lg border border-gray-200 flex flex-col">
          <span className="flex items-center gap-3.5">
            <p className="p-2.5 rounded-lg bg-blue-100 text-blue-600 w-fit">
              <User />
            </p>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold">การจัดการบัญชี</p>
              <p className="text-xs text-gray-700">
                การค่าการอนุมัติบัญชีหลังจากนำเข้าข้อมูลหรือเพิ่มข้อมูล
              </p>
            </div>
          </span>
        </div>
        <div className="w-full p-5 rounded-b-lg border border-gray-200 border-t-0 flex flex-col gap-3">
          <div className="w-full p-3.5 text-sm rounded-lg border border-gray-100 bg-gray-50 shadow-sm flex items-center justify-between">
            <span className="flex flex-col gap-0.5">
              <p>อนุมัติบัญชีศิษย์เก่าอัตโนมัติ</p>
              <p className="text-xs text-gray-700">
                อนุญาตให้ศิษย์เก่าสามารถเข้าใช้งานระบบได้หลังจากนำเข้าข้อมูล
              </p>
            </span>
            <ReactSwitch
              checked={allowedSetting.allowedAlumniAccount}
              onChange={() =>
                handleToggleSwitch(
                  "allowedAlumniAccount",
                  !allowedSetting.allowedAlumniAccount,
                )
              }
            />
          </div>
          <div className="w-full p-3.5 text-sm rounded-lg border border-gray-100 bg-gray-50 shadow-sm flex items-center justify-between">
            <span className="flex flex-col gap-0.5">
              <p>อนุมัติบัญชีบุคลากรอัตโนมัติ</p>
              <p className="text-xs text-gray-700">
                อนุญาตให้บุคลากรสามารถเข้าใช้งานระบบได้หลังจากนำเข้าข้อมูล
              </p>
            </span>
            <ReactSwitch
              checked={allowedSetting.allowedPersonelAccount}
              onChange={() =>
                handleToggleSwitch(
                  "allowedPersonelAccount",
                  !allowedSetting.allowedPersonelAccount,
                )
              }
            />
          </div>
          <div className="w-full p-3.5 text-sm rounded-lg border border-gray-100 bg-gray-50 shadow-sm flex items-center justify-between">
            <span className="flex flex-col gap-0.5">
              <p>อนุมัติบัญชีผู้ดูแลอัตโนมัติ</p>
              <p className="text-xs text-gray-700">
                อนุญาตให้ผู้ดูแลสามารถเข้าใช้งานระบบได้หลังจากเพิ่มผู้ดูแลรายใหม่
              </p>
            </span>
            <ReactSwitch
              checked={allowedSetting.allowedAdminAccount}
              onChange={() =>
                handleToggleSwitch(
                  "allowedAdminAccount",
                  !allowedSetting.allowedAdminAccount,
                )
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-5 w-full flex items-center justify-end">
        <button
          disabled={load}
          onClick={handleSave}
          className="p-2 px-3 text-sm hover:bg-blue-600 rounded-lg flex items-center gap-2 shadow-sm bg-blue-500 text-white"
        >
          {load ? (
            <>
              <Loader2 className="animate-spin" />
              <p>กำลังบันทึก...</p>
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
    </>
  );
};
export default AccountSetting;
