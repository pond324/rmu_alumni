import Loading from "@/components/loading";
import { Skeleton } from "@/components/skeletons";
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

const getNameTh = (item) => item?.name?.th || item?.name_th || "";

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
        const amphuresList =
          (provinces || []).find((p) => getNameTh(p) === province)?.districts ||
          [];
        setAmphures(amphuresList);
        const tambonsOp =
          amphuresList.find((p) => getNameTh(p) === amphure)?.sub_districts ||
          [];
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
      <div className="w-full flex flex-col gap-4 animate-pulse py-4">
        <div className="flex justify-between items-center pb-2">
          <Skeleton className="h-6 w-32 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-3 bg-gray-50/80 rounded-xl border border-gray-100 space-y-2">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-5 w-3/4 rounded-md" />
            </div>
          ))}
        </div>
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
                        label: getNameTh(a),
                        value: getNameTh(a),
                      }))
                      .find((t) => t.value === watch("province")) || null
                  }
                  isSearchable
                  onChange={(option) => {
                    setValue("amphure", "");
                    setValue("tambon", "");
                    setZipCode("");
                    setAmphures(
                      (provinces || []).find(
                        (p) => getNameTh(p) === option?.value
                      )?.districts || []
                    );
                    setValue("province", option?.value || "");
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
                    label: getNameTh(a),
                    value: getNameTh(a),
                  }))}
                  value={
                    amphures
                      ?.map((a) => ({
                        label: getNameTh(a),
                        value: getNameTh(a),
                      }))
                      .find((t) => t.value === watch("amphure")) || null
                  }
                  placeholder={"เลือกอำเภอ"}
                  onChange={(option) => {
                    setValue("tambon", "");
                    setValue("amphure", option?.value || "");
                    setZipCode("");
                    setTambons(
                      (amphures || []).find(
                        (p) => getNameTh(p) === option?.value
                      )?.sub_districts || []
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
                    label: getNameTh(a),
                    value: getNameTh(a),
                  }))}
                  value={
                    tambons
                      ?.map((a) => ({
                        label: getNameTh(a),
                        value: getNameTh(a),
                      }))
                      .find((t) => t.value === watch("tambon")) || null
                  }
                  placeholder={"เลือกตำบล"}
                  onChange={(option) => {
                    setValue("tambon", option?.value || "");
                    setZipCode(
                      (tambons || []).find(
                        (p) => getNameTh(p) === option?.value
                      )?.zip_code || ""
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
