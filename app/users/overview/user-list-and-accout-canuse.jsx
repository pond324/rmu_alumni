import FadeInSection from "@/components/fade-in-section";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { useEffect, useState } from "react";

const UserListAndAcconutCanUse = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-user-and-account-canuse",
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
    <FadeInSection className="w-full lg:w-1/2 min-w-0 p-4 sm:p-5 rounded-lg bg-white flex flex-col shadow-sm border border-gray-300">
      <p className="font-semibold">สรุปบัญชีระบบ</p>
      <p className="text-sm text-gray-700 mb-3.5">ภาพรวมการเปิด/ปิดใช้งานบัญชี</p>
      <div className="flex flex-col gap-3 my-auto">
        {data?.map((d, index) => (
          <div key={index} className="w-full flex flex-col text-sm">
            <span className="w-full flex items-center justify-between text-xs sm:text-sm">
              <p className="font-medium">{d?.name}</p>
              <p className="text-gray-600">
                {d?.canUse?.toLocaleString() || 0}/{d?.all?.toLocaleString() || 0}
              </p>
            </span>
            <div className="h-2.5 w-full bg-blue-100 rounded-full overflow-hidden mt-1.5 relative">
              <div
                style={{ width: `${d?.percent || 0}%` }}
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
              ></div>
            </div>
          </div>
        ))}
      </div>
    </FadeInSection>
  );
};
export default UserListAndAcconutCanUse;
