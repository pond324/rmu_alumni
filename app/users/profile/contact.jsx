"use client";
import Loading from "@/components/loading";
import { apiConfig } from "@/config/api.config";
import useGetSession from "@/hook/useGetSeesion";
import { alerts } from "@/libs/alerts";
import {
  formatPhoneNumber,
  isValidEmail,
  isValidThaiPhoneNumber,
} from "@/libs/validate";
import axios from "axios";
import {
  Check,
  CircleAlert,
  Contact2,
  Edit,
  Facebook,
  Mail,
  Phone,
  Plus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const Contact = () => {
  const { user } = useGetSession();
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [showOtherPhone, setShowOtherPhone] = useState(false);
  const [showOtherEmail, setShowOtherEmail] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
    reset,
  } = useForm({
    defaultValues: {
      phone1: "",
      phone2: "",
      email1: "",
      email2: "",
      facebook: "",
    },
  });

  const [load, setLoad] = useState(false);
  const fetchUserContract = async () => {
    setLoad(true);
    try {
      const res = await axios.get(apiConfig.rmuAPI + `/alumni/contract`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        const { phone1, phone2, email1, email2, facebook } = res.data;
        reset({
          ...res.data,
        });
        if (!phone1 && !phone2 && !email1 && !email2 && !facebook) {
          setEditing(true);
        }
        if (phone1 && phone2) {
          setShowOtherPhone(true);
        }
        if (email1 && email2) {
          setShowOtherEmail(true);
        }
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchUserContract();
  }, []);

  const cancelEditing = () => {
    setEditing(false);
    fetchUserContract();
  };

  const updateContact = async (payload) => {
    setUpdating(true);
    try {
      const res = await axios.post(
        apiConfig.rmuAPI + "/alumni/update-contact",
        payload,
        {
          withCredentials: true,
        },
      );
      if (res?.status === 200) {
        await alerts.success();
        cancelEditing();
        fetchUserContract();
        fetchUserContract();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setUpdating(false);
    }
  };

  if (load)
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center gap-2 py-10">
        <Loading type={2} />
        <p>กำลังโหลด...</p>
      </div>
    );

  return (
    <div className="w-full flex flex-col relative ">
      {editing ? (
        <span className="flex items-center gap-2 mb-5  w-full">
          <button
            disabled={updating}
            onClick={cancelEditing}
            className="flex items-center gap-2 p-1.5 px-2 rounded-lg border border-gray-300 shadow-sm text-sm bg-white"
          >
            <X size={15} color="red" />
            <p>ยกเลิก</p>
          </button>
          <button
            disabled={updating}
            onClick={handleSubmit(updateContact)}
            className="flex items-center gap-2 p-1.5 px-2 rounded-lg border bg-blue-500 text-white border-gray-300 shadow-sm text-sm"
          >
            <Check size={15} />

            <p>{updating ? "กำลังบันทึก..." : "บันทึก"}</p>
          </button>
        </span>
      ) : (
        <span className="flex items-center gap-2 mb-5 w-full">
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2  justify-end p-1.5 px-2.5 text-sm text-white bg-blue-500 rounded-lg border border-blue-300 shadow-md "
          >
            <Edit size={15} />
            <p>แก้ไข</p>
          </button>
        </span>
      )}

      <div className="w-full flex items-start gap-10">
        <Phone size={18} color="blue" />
        <div className="w-full lg:w-1/2 flex flex-col items-start gap-1.5">
          <p className="text-sm text-gray-500">เบอร์โทรศัพท์</p>
          <Controller
            name="phone1"
            rules={{
              required: "กรุณากรอกเบอร์โทรศัพท์ที่ติดต่อได้",
              validate: (value) => {
                if (!isValidThaiPhoneNumber(value)) {
                  return "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง";
                }
              },
            }}
            control={control}
            render={({ field }) => (
              <input
                disabled={!editing}
                {...field}
                type="text"
                value={formatPhoneNumber(field.value || "")}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.split("-").join("").length > 10) return;
                  setValue("phone1", value.split("-").join(""));
                }}
                placeholder={`กรุณาเพิ่มเบอร์โทรศัพท์ที่สามารถติดต่อได้`}
                className={`w-full text-sm bg-white ${!watch("phone1") && !editing && "placeholder-red-500"}  ${
                  editing &&
                  " p-2 border border-gray-300 shadow-sm rounded-sm px-3"
                }`}
              />
            )}
          />
          {errors.phone1 && (
            <small className="mt-1 text-red-500">{errors.phone1.message}</small>
          )}

          {showOtherPhone && (
            <>
              <Controller
                name="phone2"
                rules={{
                  required:
                    "กรุณากรอกเบอร์โทรศัพท์ที่ติดต่อได้อย่างน้อย 1 เบอร์",
                  validate: (value) => {
                    if (!isValidThaiPhoneNumber(value)) {
                      return "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง";
                    }
                    if (value === watch("phone1"))
                      return "ไม่สามารถกรอกเบอร์โทรศัพท์ซ้ำได้";
                  },
                }}
                control={control}
                render={({ field }) => (
                  <input
                    disabled={!editing}
                    {...field}
                    value={formatPhoneNumber(field.value || "")}
                    type="text"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.split("-").join("").length > 10) return;
                      setValue("phone2", value.split("-").join(""));
                    }}
                    placeholder={`เบอร์โทรศัพท์ที่สามารถติดต่อได้`}
                    className={`w-full text-sm bg-white ${
                      editing &&
                      " p-2 border border-gray-300 shadow-sm rounded-sm px-3"
                    }`}
                  />
                )}
              />
              {errors.phone2 && (
                <small className="mt-1 text-red-500">
                  {errors.phone2.message}
                </small>
              )}
              {editing && (
                <button
                  onClick={() => setShowOtherPhone(false)}
                  className="text-sm border border-gray-300  rounded-lg  mt-1 p-2  px-2.5 flex items-center gap-2"
                >
                  <X size={15} />
                  <p>ปิด</p>
                </button>
              )}
            </>
          )}
          {!showOtherPhone && editing && (
            <button
              onClick={() => setShowOtherPhone(true)}
              className="text-sm border border-gray-300 bg-blue-500 rounded-lg text-white mt-1 p-2 hover:bg-blue-600 px-2.5 flex items-center gap-2"
            >
              <Plus size={15} color="white" />
              <p>เพิ่มเบอร์ใหม่</p>
            </button>
          )}
        </div>
      </div>

      <span className="w-full mt-5 flex items-start gap-10">
        <Mail size={18} color="blue" />
        <div className="w-full lg:w-1/2 flex items-start flex-col gap-1.5">
          <p className="text-sm text-gray-500">อีเมล</p>
          <Controller
            name="email1"
            rules={{
              required: "กรุณากรอกอีเมลที่สามารถติดต่อได้อย่างน้อย 1 อีเมล",
              validate: (value) => {
                if (!isValidEmail(value)) return "รูปแบบอีเมลไม่ถูกต้อง";
              },
            }}
            control={control}
            render={({ field }) => (
              <input
                disabled={!editing}
                type="email"
                {...field}
                placeholder="เพิ่มอีเมล์ที่สามารถติดต่อได้"
                className={`w-full text-sm bg-white ${!watch("email1") && !editing && "placeholder-red-500"} ${
                  editing &&
                  "p-2 border border-gray-300 shadow-sm rounded-md px-3"
                }`}
              />
            )}
          />
          {errors.email1 && (
            <small className="mt-1 text-red-500">{errors.email1.message}</small>
          )}
          {showOtherEmail && (
            <>
              {" "}
              <Controller
                name="email2"
                rules={{
                  required: "กรุณากรอกอีเมลที่สามารถติดต่อ",
                  validate: (value) => {
                    if (!isValidEmail(value)) return "รูปแบบอีเมลไม่ถูกต้อง";
                    if (value === watch("email1"))
                      return "ไม่สามารถกรอกอีเมลซ้ำกันได้";
                  },
                }}
                control={control}
                render={({ field }) => (
                  <input
                    disabled={!editing}
                    type="email"
                    {...field}
                    placeholder="อีเมล์ที่สามารถติดต่อได้"
                    className={`w-full text-sm bg-white ${
                      editing &&
                      "p-2 border border-gray-300 shadow-sm rounded-md px-3"
                    }`}
                  />
                )}
              />
              {errors.email2 && (
                <small className="mt-1 text-red-500">
                  {errors.email2.message}
                </small>
              )}
              {editing && (
                <button
                  onClick={() => setShowOtherEmail(false)}
                  className="text-sm border border-gray-300 rounded-lg t-1 p-2 px-2.5 flex items-center gap-2"
                >
                  <X size={15} />
                  <p>ปิด</p>
                </button>
              )}
            </>
          )}
          {!showOtherEmail && editing && (
            <button
              onClick={() => setShowOtherEmail(true)}
              className="text-sm border border-gray-300 bg-blue-500 rounded-lg text-white mt-1 p-2 hover:bg-blue-600 px-2.5 flex items-center gap-2"
            >
              <Plus size={15} color="white" />
              <p>เพิ่มอีเมลใหม่</p>
            </button>
          )}
        </div>
      </span>

      <span className="w-full mt-5 flex items-start gap-10">
        <Facebook size={18} color="blue" />
        <div className="w-full lg:w-1/2 flex flex-col gap-1.5">
          <p className="text-sm text-gray-500">เฟสบุ๊ค</p>
          <Controller
            name="facebook"
            control={control}
            render={({ field }) => (
              <input
                disabled={!editing}
                {...field}
                value={field.value || ""}
                type="text"
                placeholder="เฟสบุ๊คที่สามารถติดต่อได้"
                className={`text-sm ${
                  editing &&
                  "p-2 border border-gray-300 shadow-sm rounded-md px-3"
                }`}
              />
            )}
          />
        </div>
      </span>
    </div>
  );
};
export default Contact;
