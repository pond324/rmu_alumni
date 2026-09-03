import FadeInSection from "@/components/fade-in-section";
import PieChartComponentWithActiveTooltips from "@/components/pie-chart-active-tooltip";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { useEffect, useState } from "react";

const AlumniGroupByWorkBarChart = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-alumni-groupbywork",
        { withCredentials: true },
      );
      if (res.status === 200) {
        const data = [
          {
            name: "ทำงานไทย",
            value: res?.data?.workInThai || 0,
            color: "#60A5FA",
          },
          {
            name: "ทำงานต่างประเทศ",
            value: res?.data?.workInOther || 0,
            color: "#34D399",
          },
          {
            name: "ศึกษาต่อ",
            value: res?.data?.continueStudy || 0,
            color: "#37b24d",
          },
          {
            name: "ว่างงาน",
            value: res?.data?.NoJob || 0,
            color: "#F87171",
          },
          {
            name: "ไม่พบข้อมูล",
            value: res?.data?.NoData || 0,
            color: "#868e96",
          },
        ];
        const chartData = data.filter((d) => d.value > 0);
        setData(chartData);
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
    <FadeInSection className="w-full lg:w-1/3 min-w-0 p-4 sm:p-5 rounded-xl border border-gray-200 shadow-xs bg-white flex flex-col justify-between items-center">
      <div className="w-full">
        <p className="font-semibold w-full">สถานะการทำงาน</p>
        <p className="text-sm text-gray-700 w-full">
          ประวัติการทำงานและการศึกษาต่อของศิษย์เก่า
        </p>
        <div className="w-full mt-2.5 mb-3.5 text-xs sm:text-sm flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 sm:gap-2">
            <p className="p-1.5 rounded-sm bg-blue-400"></p>
            <p>ทำงานไทย</p>
          </span>
          <span className="flex items-center gap-1.5 sm:gap-2">
            <p className="p-1.5 rounded-sm bg-emerald-400"></p>
            <p>ทำงานต่างประเทศ</p>
          </span>
          <span className="flex items-center gap-1.5 sm:gap-2">
            <p className="p-1.5 rounded-sm bg-green-400"></p>
            <p>ศึกษาต่อ</p>
          </span>
          <span className="flex items-center gap-1.5 sm:gap-2">
            <p className="p-1.5 rounded-sm bg-red-400"></p>
            <p>ว่างงาน</p>
          </span>
          <span className="flex items-center gap-1.5 sm:gap-2">
            <p className="p-1.5 rounded-sm bg-gray-400"></p>
            <p>ไม่พบข้อมูล</p>
          </span>
        </div>
      </div>
      <div className="w-full flex items-center justify-center min-w-0 my-auto">
        <PieChartComponentWithActiveTooltips data={data} />
      </div>
    </FadeInSection>
  );
};
export default AlumniGroupByWorkBarChart;
