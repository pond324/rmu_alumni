import { BookUser, GraduationCap, X } from "lucide-react";
import { useEffect, useState } from "react";
import { eduLevels } from "@/data/faculty";
import Modal from "@/components/modal";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import RowLoader from "@/components/row-loader";
import RowDataNotFound from "@/components/row-data-notfound";

const ViewEduLevel = () => {
  const [showModal, setShowModal] = useState(false);
  const [load, setLoad] = useState(true);
  const [eduLevel, setedulevelList] = useState([]);
  const getEduList = async (search, page) => {
    setLoad(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-edulevels",
        { params: { search, page, isOptions: true } },
      );
      if (res.status === 200) {
        setedulevelList(res.data.data || []);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    getEduList();
  }, []);

  return (
    <>
      <>
        <button
          onClick={() => setShowModal(true)}
          className="p-1.5 px-2 rounded-full text-xs flex items-center gap-2 bg-gray-100 shadow-sm hover:bg-blue-500 hover:text-white"
        >
          <GraduationCap size={16} />
          <p>ดูรหัสระดับการศึกษา</p>
        </button>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="w-full lg:w-1/2 h-[550px] overflow-auto rounded-lg z-50 bg-white flex flex-col">
            <div className="w-full flex p-5 items-start justify-between">
              <span className="flex flex-col">
                <p className="font-semibold">รหัสระดับการศึกษา</p>
                <p className="text-gray-700 text-sm">
                  ข้อมูลระดับการศึกษาที่ระบบรองรับ
                </p>
              </span>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-200"
              >
                <X />
              </button>
            </div>
            <div className="p-5 pt-5 border-t border-gray-300 w-full">
              <p className="mt-2 text-sm text-gray-600">
                ทั้งหมด {eduLevel.length} ระดับการศึกษา
              </p>
              <div className="w-full h-[300px] lg:h-[400px] mt-2.5 overflow-auto ">
                {" "}
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300 sticky top-0">
                      <th className="p-2.5 pb-3 text-start bg-blue-50 font-normal text-sm">
                        รหัส
                      </th>
                      <th className="p-2.5 pb-3 text-start bg-blue-50 font-normal text-sm">
                        ระดับการศึกษา
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {load ? (
                      <RowLoader numcol={2} />
                    ) : eduLevel.length < 1 ? (
                      <RowDataNotFound numCol={2} />
                    ) : (
                      eduLevel?.map((f, index) => (
                        <tr key={index} className="border-b border-gray-300">
                          <td className="p-2.5 pb-3 text-start text-sm border-r border-gray-300">
                            {f?.edu_levelId}
                          </td>
                          <td className="p-2.5 pb-3 text-start text-sm">
                            {f?.edu_level_name}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal>
      </>
    </>
  );
};
export default ViewEduLevel;
