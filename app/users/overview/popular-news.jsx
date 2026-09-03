import FadeInSection from "@/components/fade-in-section";
import RowDataNotFound from "@/components/row-data-notfound";
import RowLoader from "@/components/row-loader";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import { DateTHFormat } from "@/libs/thai-local-formate-date";
import axios from "axios";
import { useEffect, useState } from "react";

const PopularNews = () => {
  const [load, setLoad] = useState(true);
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-popularnews",
        { withCredentials: true },
      );
      if (res.status === 200) {
        setData(res?.data);
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
    <FadeInSection className="w-full lg:w-1/2 min-w-0 p-4 sm:p-5 rounded-lg border border-gray-300 bg-white shadow-sm flex flex-col justify-between">
      <p className="font-semibold">ข่าว/กิจกรรม ยอดนิยม</p>
      <div className="mt-3.5 w-full max-h-[300px] overflow-auto">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="border-b border-gray-300 sticky top-0 left-0 bg-white z-10">
              <th className="text-sm font-normal text-start p-2.5 pb-3 text-gray-700">
                หัวข้อ
              </th>
              <th className="text-sm font-normal text-start p-2.5 pb-3 text-gray-700">
                หมวดหมู่
              </th>
              <th className="text-sm font-normal text-end p-2.5 pb-3 text-gray-700">
                ยอดเข้าชม
              </th>
              <th className="text-sm font-normal text-start p-2.5 pb-3 text-gray-700">
                แก้ไขล่าสุด
              </th>
            </tr>
          </thead>
          <tbody>
            {load ? (
              <RowLoader numcol={4} />
            ) : data.length < 1 ? (
              <RowDataNotFound numCol={4} />
            ) : (
              data?.map((d, index) => (
                <tr key={index} className="hover:bg-blue-50">
                  <td className="p-2.5 pb-3 border-b border-gray-300 text-sm">
                    <p className="font-semibold max-w-[180px] sm:max-w-[240px] line-clamp-1">
                      {d?.title}
                    </p>
                  </td>
                  <td className="p-2.5 pb-3 border-b border-gray-300 text-sm">
                    <p className="text-xs p-0.5 px-2 w-fit rounded-full text-blue-600 bg-blue-50 shadow-xs whitespace-nowrap">
                      {d?.category == 0 ? "ข่าวสาร/กิจกรรม" : "โครงการบริจาค"}
                    </p>
                  </td>
                  <td className="p-2.5 pb-3 border-b border-gray-300 text-sm text-end">
                    <p className="text-gray-700">
                      {d?.view?.toLocaleString() || 0}
                    </p>
                  </td>
                  <td className="p-2.5 pb-3 border-b border-gray-300 text-sm whitespace-nowrap">
                    <p className="text-gray-700">
                      {DateTHFormat(d?.updatedAt)}
                    </p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </FadeInSection>
  );
};
export default PopularNews;
