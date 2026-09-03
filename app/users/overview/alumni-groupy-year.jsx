
import ChartSimpleSkeleton from "@/components/chart-simple-skeleton";
import CustomAreaChart from "@/components/custom-area-chart";
import FadeInSection from "@/components/fade-in-section";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { useEffect, useState } from "react";

const AlumniGroupByYear = () => {
  const [load, setLoad] = useState(true);
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/alumni-groupby-year",
        { withCredentials: true },
      );
      if (res.status === 200) {
        setData(res.data?.data);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <FadeInSection className="w-full lg:w-2/3 min-w-0 p-4 sm:p-5 rounded-lg bg-white flex flex-col justify-between shadow-sm border border-gray-300">
      <div>
        <p className="font-semibold">ศิษย์เก่าตามปีการศึกษา</p>
        <p className="text-sm text-gray-700 mb-4 sm:mb-6">
          จำนวนศิษย์เก่าทั้งหมดจำแนกตามปีการศึกษา (10 ปีหลังสุด)
        </p>
      </div>
      {load ? (
        <ChartSimpleSkeleton />
      ) : (
        <div className="w-full min-w-0">
          <CustomAreaChart data={data} name={"ศิษย์เก่า (คน)"} />
        </div>
      )}
    </FadeInSection>
  );
};
export default AlumniGroupByYear;
