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
    <FadeInSection className="w-full lg:w-1/3 rounded-lg bg-white flex flex-col shadow-sm border p-5 border-gray-300">
      <p className="font-semibold">สถิติการส่งข้อความ</p>
      <p className="text-sm text-gray-700">แยกตามประเภทผู้ส่ง</p>
      <div className="w-full mt-2.5 mb-3.5 text-sm flex items-center gap-3.5 flex-wrap">
        <span className="flex items-center gap-2">
          <p className="p-1.5 rounded-sm bg-[#3B82F6]"></p>
          <p>ผู้ดูแล</p>
        </span>
        <span className="flex items-center gap-2">
          <p className="p-1.5 rounded-sm bg-[#60A5FA]"></p>
          <p>อาจารย์/ผู้บริหาร</p>
        </span>
        <span className="flex items-center gap-2">
          <p className="p-1.5 rounded-sm bg-[#93C5FD]"></p>
          <p>ศิษย์เก่า</p>
        </span>
      </div>
      <div className="w-full flex flex-col gap-2.5 justify-center h-90 items-center">
        {data?.length < 1 ? (
          <>
            <FolderOpen size={45} />
            <p>ไม่พบข้อมูล</p>
          </>
        ) : (
          <DonutChart data={data} color={["#3B82F6", "#60A5FA", "#93C5FD"]} />
        )}
      </div>
    </FadeInSection>
  );
};
export default SendTextGroupbySender;
