"use client";
import { Ban, CheckCircle2, UserCheck } from "lucide-react";

export const SelectAccountStatus = ({
  value = "",
  onChange,
  setPage,
}) => {
  const handleChange = (e) => {
    if (onChange) onChange(e.target.value);
    if (setPage) setPage(1);
  };

  const displayText =
    value === "true"
      ? "เปิดใช้งาน"
      : value === "false"
      ? "ถูกระงับ"
      : "สถานะบัญชีทั้งหมด";

  return (
    <div title="ค้นหาตามสถานะบัญชี" className="relative">
      <select
        onChange={handleChange}
        value={value || ""}
        id="select-account-status"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      >
        <option value="" className="text-sm">
          สถานะบัญชีทั้งหมด
        </option>
        <option value="true" className="text-sm">
          เปิดใช้งาน
        </option>
        <option value="false" className="text-sm">
          ถูกระงับ
        </option>
      </select>
      <label
        htmlFor="select-account-status"
        className={`h-[38px] px-3.5 rounded-lg border shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
          value === "true"
            ? "bg-green-50/70 border-green-300 text-green-700 hover:bg-green-100/70"
            : value === "false"
            ? "bg-red-50/70 border-red-300 text-red-700 hover:bg-red-100/70"
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        {value === "true" ? (
          <CheckCircle2 size={16} className="text-green-600 shrink-0" />
        ) : value === "false" ? (
          <Ban size={16} className="text-red-500 shrink-0" />
        ) : (
          <UserCheck size={16} className="text-gray-500 shrink-0" />
        )}
        <p className="text-sm font-medium">{displayText}</p>
      </label>
    </div>
  );
};

export default SelectAccountStatus;
