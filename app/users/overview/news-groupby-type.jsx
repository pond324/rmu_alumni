import DonutChart from "@/components/donut-chart";
import FadeInSection from "@/components/fade-in-section";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { FolderOpen } from "lucide-react";
import { useEffect, useState } from "react";

const NewsGroupByType = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/news-groupby-category",
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
    <FadeInSection className="w-full min-w-0 rounded-lg bg-white flex flex-col justify-between shadow-sm border p-4 sm:p-5 border-gray-300">
      <div>
        <p className="font-semibold">ข่าวสาร/กิจกรรมและโครงการบริจาค</p>
        <p className="text-sm text-gray-700">จำนวนข่าวสาร กิจกรรมและโครงการบริจาคทั้งหมด</p>
        <div className="w-full mt-2.5 mb-3.5 text-xs sm:text-sm flex items-center gap-2 sm:gap-3.5 flex-wrap">
          <span className="flex items-center gap-1.5 sm:gap-2">
            <p className="p-1.5 rounded-sm bg-[#60A5FA]"></p>
            <p>ข่าวสาร/กิจกรรม</p>
          </span>
          <span className="flex items-center gap-1.5 sm:gap-2">
            <p className="p-1.5 rounded-sm bg-[#F87171]"></p>
            <p>โครงการบริจาค</p>
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
          <DonutChart data={data} color={["#60A5FA", "#F87171"]} />
        )}
      </div>
    </FadeInSection>
  );
};
export default NewsGroupByType;
