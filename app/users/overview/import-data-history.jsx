import FadeInSection from "@/components/fade-in-section";
import RowDataNotFound from "@/components/row-data-notfound";
import RowLoader from "@/components/row-loader";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import { formatFileSize } from "@/libs/file-helper";
import { DateTHFormat } from "@/libs/thai-local-formate-date";
import axios from "axios";
import { FileTerminalIcon, User } from "lucide-react";
import { useEffect, useState } from "react";

const ImportDataHistory = () => {
  const [load, setLoad] = useState(true);
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-import-history",
        {
          withCredentials: true,
          params: {
            take: 10,
            page: 1,
          },
        },
      );
      if (res.status === 200) {
        setData(res?.data?.data);
        console.log("🚀 ~ getData ~ res?.data?.data:", res?.data?.data)
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
    <FadeInSection className="w-full min-w-0 mt-5 p-4 sm:p-5 rounded-lg bg-white flex flex-col shadow-sm border border-gray-300">
      <p className="font-semibold">ประวัติการนำเข้าข้อมูลล่าสุด</p>
      <div className="w-full mt-3.5 overflow-x-auto">
        <table className="w-full min-w-[620px]">
          <thead>
            <tr className="border-b border-gray-300 sticky top-0 left-0 bg-white z-10">
              <th className="text-sm font-normal text-start p-2.5 pb-3 text-gray-700">
                ไฟล์
              </th>
              <th className="text-sm font-normal text-start p-2.5 pb-3 text-gray-700">
                ประเภท
              </th>
              <th className="text-sm font-normal text-start p-2.5 pb-3 text-gray-700">
                จำนวนแถว
              </th>
              <th className="text-sm font-normal text-start p-2.5 pb-3 text-gray-700">
                ผู้นำเข้า
              </th>
              <th className="text-sm font-normal text-start p-2.5 pb-3 text-gray-700">
                วันที่
              </th>
            </tr>
          </thead>
          <tbody>
            {load ? (
              <RowLoader numcol={5} />
            ) : data.length < 1 ? (
              <RowDataNotFound numCol={5} />
            ) : (
              data?.map((d, index) => (
                <tr
                  key={index}
                  className="border-b text-sm border-gray-300 hover:bg-blue-50"
                >
                  <td className="p-2.5">
                    <div className="flex items-center gap-2">
                      <p className="p-2 rounded-lg bg-blue-100 text-blue-600 shrink-0">
                        {" "}
                        <FileTerminalIcon size={16} />
                      </p>
                      <div className="flex flex-col min-w-0">
                        <p className="font-medium max-w-[200px] truncate">{d?.file_name}</p>
                        <p className="text-xs text-gray-500 font-semibold">
                          {formatFileSize(Number(d?.file_size || 0))}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-2.5">
                    <p className="whitespace-nowrap">
                      {d?.import_type === "alumni" ? "ข้อมูลศิษย์เก่า" : "ข้อมูลบุคลากร"}
                    </p>
                  </td>
                  <td className="p-2.5">
                    <p className="text-blue-600 font-medium">
                      {d?.total_rows?.toLocaleString("th-TH") || 0}
                    </p>
                  </td>
                  <td className="p-2.5">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <p className="p-2 rounded-lg bg-blue-100 text-blue-600 shrink-0">
                        {" "}
                        <User size={16} />
                      </p>
                      <p>
                        {d?.admin?.prefix}
                        {d?.admin?.fname} {d?.admin?.lname}
                      </p>
                    </div>
                  </td>
                  <td className="p-2.5 whitespace-nowrap">
                    <p>{new Date(d?.created_at).toLocaleDateString("th-TH")}</p>
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
export default ImportDataHistory;
