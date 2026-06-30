import DonutChart from "@/components/donut-chart";
import FadeInSection from "@/components/fade-in-section";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { useEffect, useState } from "react";

const AlumniRegisDonutChart = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + `/president/alumni-regis-status-stats`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        setData([
          { name: "ลงทะเบียนแล้ว", value: res?.data?.accepts || 0 },
          { name: "ยังไม่ลงทะเบียน", value: res?.data?.no_regis || 0 },
          { name: "รอตรวจสอบ", value: res?.data?.pendings || 0 },
          { name: "การชำระถูกปฏิเสธ", value: res?.data?.refuses || 0 },
        ]);
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
    <FadeInSection className="w-full h-full lg:w-1/3 p-5 rounded-lg flex flex-col items-center bg-white border border-gray-300 shadow-sm">
      <p className="font-semibold w-full">สถานะการลงทะเบียน</p>
      <p className="text-sm text-gray-600 mb-3 w-full">
        สถานะการลงทะเบียนของศิษย์เก่า
      </p>
     cd b 
     c
      <DonutChart
        data={data}
        color={["#60A5FA", "#9CA3AF", "#fbbf24", "#F87171"]}
      />
    </FadeInSection>
  );
};
export default AlumniRegisDonutChart;
