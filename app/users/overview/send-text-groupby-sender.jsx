import DonutChart from "@/components/donut-chart";
import FadeInSection from "@/components/fade-in-section";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { FolderOpen } from "lucide-react";
import { useEffect, useState } from "react";

const SendTextGroupbySender = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/send-text-grouby-sender",
        { withCredentials: true },
      );
      if (res.status === 200) {
        setData(res?.data?.data);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <FadeInSection className="w-full min-w-0 rounded-xl bg-white flex flex-col justify-between shadow-xs border p-4 sm:p-5 border-gray-200">
      <div>
        <p className="font-semibold">สถิติการส่งข้อความ</p>
        <p className="text-sm text-gray-700">แยกตามประเภทผู้ส่ง</p>
        <div className="w-full mt-2.5 mb-3.5 text-xs sm:text-sm flex items-center gap-2 sm:gap-3.5 flex-wrap">
          <span className="flex items-center gap-1.5 sm:gap-2">
            <p className="p-1.5 rounded-sm bg-[#3B82F6]"></p>
            <p>ผู้ดูแล</p>
          </span>
          <span className="flex items-center gap-1.5 sm:gap-2">
            <p className="p-1.5 rounded-sm bg-[#60A5FA]"></p>
            <p>อาจารย์/ผู้บริหาร</p>
          </span>
          <span className="flex items-center gap-1.5 sm:gap-2">
            <p className="p-1.5 rounded-sm bg-[#93C5FD]"></p>
            <p>ศิษย์เก่า</p>
          </span>
        </div>
      </div>
      <div className="w-full min-w-0 flex flex-col gap-2.5 justify-center items-center my-auto">
        {data?.length < 1 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
            <FolderOpen size={40} className="opacity-50" />
            <p className="text-sm">ไม่พบข้อมูล</p>
          </div>
        ) : (
          <DonutChart data={data} color={["#3B82F6", "#60A5FA", "#93C5FD"]} />
        )}
      </div>
    </FadeInSection>
  );
};
export default SendTextGroupbySender;
