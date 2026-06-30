import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { useEffect, useState } from "react";
import DonutChart from "@/components/donut-chart";
import FadeInSection from "@/components/fade-in-section";

const ProfessorGroupByPosition = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + `/president/professor-groupby-position`,
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
    <FadeInSection className="w-full lg:w-1/3 p-5 rounded-lg bg-white border border-gray-300 shadow-sm flex flex-col items-center">
      <p className="font-semibold w-full">บุคลากรจำแนกตามตำแหน่ง</p>
      <p className="text-sm text-gray-700 w-full">
        จำนวนบุคลากรจำแนกตามตำแหน่ง
      </p>
      <div className="w-full h-100 flex flex-col items-center">
        {" "}
        <DonutChart data={data} />
      </div>
    </FadeInSection>
  );
};
export default ProfessorGroupByPosition;
