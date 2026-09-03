import ChartSimple from "@/components/chart-simple";
import ChartSimpleSkeleton from "@/components/chart-simple-skeleton";
import { facultyText } from "@/components/faculty-p";
import FadeInSection from "@/components/fade-in-section";
import { apiConfig } from "@/config/api.config";
import { useFacultyDep } from "@/hook/useFacultyDep";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { useEffect, useState } from "react";

const AlumniGroupByFacBarChart = () => {
  const { faculties } = useFacultyDep();
  const [load, setLoad] = useState(true);
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + `/president/chartbar-alumni-groupbyfac`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        const data = res.data.map((a) => ({
          ...a,
          name: facultyText(faculties, a.facId),
        }));
        // console.log("🚀 ~ getData ~ res.data:", res.data)
        setData(data);
        // console.log("🚀 ~ getData ~ res.data:",data);
      }
    } catch (error) {
      alerts.err();
      console.error(error);
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    getData();
  }, [faculties]);

  return (
    <FadeInSection className="w-full lg:w-2/3 min-w-0 p-4 sm:p-5 border border-gray-200 shadow-xs rounded-xl bg-white flex flex-col justify-between">
      <div>
        <p className="font-semibold">ศิษย์เก่าจำแนกตามคณะ</p>
        <p className="text-sm text-gray-600 mb-3">แยกตามเพศ</p>
        <div className="mt-1.5 w-full flex flex-wrap text-sm items-center justify-center gap-2.5">
          <span className="flex items-center gap-2">
            <p className="p-2 rounded-sm bg-blue-500"></p>
            <p>เพศชาย</p>
          </span>
          <span className="flex items-center gap-2">
            <p className="p-2 ml-1 sm:ml-2.5 rounded-sm bg-pink-500"></p>
            <p>เพศหญิง</p>
          </span>
        </div>
      </div>
      {load ? (
        <ChartSimpleSkeleton />
      ) : (
        <div className="w-full min-w-0 mt-3">
          <ChartSimple
            key1={"mens"}
            key2={"girls"}
            color1={"#60A5FA"}
            color2={"#F472B6"}
            data={data}
          />
        </div>
      )}
    </FadeInSection>
  );
};
export default AlumniGroupByFacBarChart;
