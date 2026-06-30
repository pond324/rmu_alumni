import Loading from "@/components/loading";
import { apiConfig } from "@/config/api.config";
import useProvince from "@/hook/useProvince";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import {
  Building2,
  Check,
  Edit,
  Mailbox,
  Map,
  MapPin,
  MapPinCheck,
  MapPinHouse,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const LiveContact = () => {
  const [editing, setEditing] = useState(false);
  const { loading, provinceOptions, provinces } = useProvince();
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      address: "",
      tambon: "",
      amphure: "",
      province: "",
    },
  });
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [zipCode, setZipCode] = useState("");

  const [load, setLoad] = useState(false);
  const fetchUserContract = async () => {
    setLoad(true);
    try {
      const res = await axios.get(apiConfig.rmuAPI + `/alumni/contract`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        const { address, tambon, amphure, province, zipcode } = res.data;
        console.log("🚀 ~ fetchUserContract ~ province:", province);
        reset({
          address: address || "",
          tambon: tambon || "",
          amphure: amphure || "",
          province: province || "",
        });
        const amphures = provinces.filter((p) => p.name_th === province)[0]
          ?.districts;
        setAmphures(
          provinces.filter((p) => p.name_th === province)[0]?.districts,
        );
        const tambonsOp = amphures?.filter((p) => p.name_th === amphure)[0]
          ?.sub_districts;
        setTambons(tambonsOp);
        setZipCode(zipcode);
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
  }, [provinces]);

  const [saving, setSaving] = useState(false);
  const saveData = async (data) => {
    setSaving(true);
    try {
      const payload = {
        address: data.address,
        tambon: data.tambon,
        amphure: data.amphure,
        province: data.province,
        zipcode: zipCode,
      };

      const res = await axios.post(
        apiConfig.rmuAPI + "/alumni/update-live",
        payload,
        { withCredentials: true },
      );

      if (res?.data?.err) {
        return alerts.err(res?.data?.err);
      }
      if (res?.status === 200) {
        await alerts.success();
        fetchUserContract();
        setEditing(false);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setSaving(false);
    }
  };

  if (load)
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center  gap-2 py-10">
        <Loading type={2} />
        <p>กำลังโหลด...</p>
      </div>
    );

  return (
    <div className="w-full flex flex-col bg-white">
      {editing ? (
        <span className="flex items-center gap-2 mb-5  w-full">
          <button
            disabled={saving}
            onClick={() => {
              fetchUserContract();
              setEditing(false);
            }}
            className="flex items-center gap-2 p-1.5 px-2 rounded-lg border border-gray-300 shadow-sm text-sm bg-white"
          >
            <X size={15} color="red" />
            <p>ยกเลิก</p>
          </button>
          <button
            disabled={saving}
            onClick={handleSubmit(saveData)}
            className="flex items-center gap-2 p-1.5 px-2 rounded-lg border bg-blue-500 text-white border-gray-300 shadow-sm text-sm"
          >
            <Check size={15} />

            <p>{saving ? "กำลังบันทึก..." : "บันทึก"}</p>
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

      <span className="w-full mt-5 flex items-start gap-10">
        <Building2 size={18} color="blue" />
        <div className="w-full lg:w-1/2 flex flex-col gap-0.5">
          <p className="text-sm text-gray-500 mb-1">ที่อยู่</p>
          {editing ? (
            <Controller
              name="address"
              rules={{ required: "โปรดระบุรายละเอียดที่อยู่" }}
              control={control}
              render={({ field }) => (
                <input
                  disabled={!editing}
                  {...field}
                  type="text"
                  value={field.value || ""}
                  placeholder="รายละเอียดที่อยู่"
                  className={`w-full text-sm ${
                    editing &&
                    " p-2 border border-gray-300 shadow-sm rounded-md px-3"
                  }`}
                />
              )}
            />
          ) : (
            <p>{watch("address") || "-"}</p>
          )}
          {errors.address && editing && (
            <small className="text-sm text-red-500 mt-1 ml-1">
              {errors.address.message}
            </small>
          )}
        </div>
      </span>
      <span className="w-full mt-5 flex items-start gap-10">
        <MapPinCheck size={18} color="blue" />
        <div className="w-full lg:w-1/2 flex flex-col gap-0.5">
          <p className="text-sm text-gray-500">จังหวัด</p>
          {editing ? (
            <Controller
              name="province"
              rules={{
                required: "โปรดระบุจังหวัด",
              }}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isDisabled={loading}
                  options={provinceOptions}
                  placeholder={"เลือกจังหวัด"}
                  value={
                    provinces
                      ?.map((a) => ({
                        label: a.name_th,
                        value: a.name_th,
                      }))
                      .find((t) => t.value === watch("province")) || null
                  }
                  isSearchable
                  onChange={(option) => {
                    setValue("amphure", "");
                    setValue("tambon", "");
                    setZipCode("");
                    setAmphures(
                      provinces.filter((p) => p.name_th === option.value)[0]
                        ?.districts,
                    );
                    setValue("province", option.value);
                  }}
                  className="mt-1 text-sm w-full"
                />
              )}
            />
          ) : (
            <p>{watch("province") || "-"}</p>
          )}
          {errors.province && editing && (
            <small className="text-sm text-red-500 mt-1 ml-1">
              {errors.province.message}
            </small>
          )}
        </div>
      </span>
      <span className="w-full mt-5 flex items-start gap-10">
        <Map size={18} color="blue" />
        <div className="w-full lg:w-1/2 flex flex-col gap-0.5">
          <p className="text-sm text-gray-500">อำเภอ/เขต</p>
          {editing ? (
            <Controller
              name="amphure"
              rules={{
                required: "โปรดเลือกอำเภอ",
              }}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isDisabled={loading || !watch("province")}
                  options={amphures?.map((a) => ({
                    label: a.name_th,
                    value: a.name_th,
                  }))}
                  value={
                    amphures
                      ?.map((a) => ({
                        label: a.name_th,
                        value: a.name_th,
                      }))
                      .find((t) => t.value === watch("amphure")) || null
                  }
                  placeholder={"เลือกอำเภอ"}
                  onChange={(option) => {
                    setValue("tambon", "");
                    setValue("amphure", option.value);
                    setZipCode("");
                    setTambons(
                      amphures?.filter((p) => p.name_th === option.value)[0]
                        ?.sub_districts,
                    );
                  }}
                  isSearchable
                  className="mt-1 text-sm w-full"
                />
              )}
            />
          ) : (
            <p>{watch("amphure") || "-"}</p>
          )}
          {errors.amphure && editing && (
            <small className="text-sm text-red-500 mt-1 ml-1">
              {errors.amphure.message}
            </small>
          )}
        </div>
      </span>

      <span className="w-full mt-5 flex items-start gap-10">
        <MapPin size={18} color="blue" />
        <div className="w-full lg:w-1/2 flex flex-col gap-0.5">
          <p className="text-sm text-gray-500">ตำบล/แขวง</p>
          {editing ? (
            <Controller
              name="tambon"
              rules={{
                required: "โปรดเลือกตำบล",
              }}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isDisabled={
                    loading || !watch("province") || !watch("amphure")
                  }
                  options={tambons?.map((a) => ({
                    label: a.name_th,
                    value: a.name_th,
                  }))}
                  value={
                    tambons
                      ?.map((a) => ({
                        label: a.name_th,
                        value: a.name_th,
                      }))
                      .find((t) => t.value === watch("tambon")) || null
                  }
                  placeholder={"เลือกตำบล"}
                  onChange={(option) => {
                    setValue("tambon", option.value);
                    setZipCode(
                      tambons?.filter((p) => p.name_th === option.value)[0]
                        ?.zip_code,
                    );
                  }}
                  isSearchable
                  className="mt-1 text-sm w-full"
                />
              )}
            />
          ) : (
            <p>{watch("tambon") || "-"}</p>
          )}
          {errors.tambon && editing && (
            <small className="text-sm text-red-500 mt-1 ml-1">
              {errors.tambon.message}
            </small>
          )}
        </div>
      </span>

      <span className="w-full mt-5 flex items-start gap-10">
        <Mailbox size={18} color="blue" />
        <div className="w-full lg:w-1/2 flex flex-col gap-0.5">
          <p className="text-sm text-gray-500">รหัสไปรษณีย์</p>
          <p>{zipCode || "-"}</p>
        </div>
      </span>
    </div>
  );
};
export default LiveContact;
