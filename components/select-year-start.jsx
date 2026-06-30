import { apiConfig } from "@/config/api.config";
import axios from "axios";
import { Calendar1, CalendarCheck } from "lucide-react";
import { useEffect, useState } from "react";

const currentYear = new Date().getFullYear() + 543; // แปลง ค.ศ. → พ.ศ.
const yearsStart = Array.from({ length: 30 }, (_, i) => currentYear - i);
const yearsEnd = Array.from(
  { length: 30 },
  (_, i) => new Date().getFullYear() + 520 + i,
);

export const SelectYearStart = ({
  setSelectYearStart,
  selectYearStart,
  setPage,
}) => {
  const [load, setLoad] = useState(true);
  const [yearStart, setYearStart] = useState(yearsStart);
  const getYearOptions = async () => {
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/president/year-options");
      const { yearStart } = res.data;
      setYearStart(yearStart);
    } catch (error) {
      console.error("Error fetching year options:", error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    getYearOptions();
  }, []);

  return (
    <div title="ค้นหาปีที่เข้าศึกษา" className="relative inline-block bg-white">
      <select
        onChange={(e) => {
          setSelectYearStart(e.target.value);
          setPage(1);
        }}
        value={selectYearStart}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      >
        {yearStart.map((y, index) => (
          <option key={index} className="text-sm" value={y}>
            พ.ศ. {y}
          </option>
        ))}
      </select>
      <label
        htmlFor="select-row"
        className="p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
      >
        <Calendar1 size={17} />
        <p className="text-sm">
          {load ? "กำลังโหลด..." : `ปีที่เข้าศึกษา ${selectYearStart && `พ.ศ. ${selectYearStart}`}`}
        </p>
      </label>
    </div>
  );
};

export const SelectYearEnd = ({ setSelectYearEnd, selectYearEnd, setPage }) => {
  const [load, setLoad] = useState(true);
  const [yearEnd, setYearEnd] = useState(yearsEnd);
  const getYearOptions = async () => {
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/president/year-options");
      const { yearEnd } = res.data;
      setYearEnd(yearEnd);
    } catch (error) {
      console.error("Error fetching year options:", error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    getYearOptions();
  }, []);
  return (
    <div title="ค้นหาปีที่เข้าศึกษา" className="relative inline-block bg-white">
      <select
        onChange={(e) => {
          setSelectYearEnd(e.target.value);
          setPage(1);
        }}
        value={selectYearEnd}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      >
        {yearEnd.map((y, index) => (
          <option key={index} className="text-sm" value={y}>
            พ.ศ. {y}
          </option>
        ))}
      </select>
      <label
        htmlFor="select-row"
        className="p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
      >
        <CalendarCheck size={17} />
        <p className="text-sm">
          {load ? "กำลังโหลด..." : `ปีที่สำเร็จการศึกษา ${selectYearEnd && `พ.ศ. ${selectYearEnd}`}`}
        </p>
      </label>
    </div>
  );
};
