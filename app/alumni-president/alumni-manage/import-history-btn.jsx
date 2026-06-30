import DropdownMenu from "@/components/dropdown";
import Modal from "@/components/modal";
import SearchBox from "@/components/search-box";
import {
  FileTerminalIcon,
  History,
  HistoryIcon,
  Loader2,
  RotateCcw,
  Trash,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DeleteAlumniFormImportHistoryBtn from "./delete-alumni-form-import-history-btn";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import PaginationBtn from "@/components/pageination-btn";
import { forwardPage, prevPage } from "@/libs/pagination-helper";
import { debounce } from "lodash";
import RowLoader from "@/components/row-loader";
import RowDataNotFound from "@/components/row-data-notfound";
import { formatFileSize } from "@/libs/file-helper";
import DeleteProfessorFormImportHistoryBtn from "../personels-manage/delete-personel-history-btn";

const ImportHistoryData = ({ fetchAlumni, type = "alumni" }) => {
  //   console.log("🚀 ~ ImportHistoryData ~ fetchAlumni:", fetchAlumni)
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [load, setLoad] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(1);

  const getData = async (search, date, page) => {
    setLoad(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-import-history",
        {
          withCredentials: true,
          params: {
            search,
            date,
            page,
            type,
          },
        },
      );
      if (res.status === 200) {
        setDataList(res.data?.data);
        setTotal(res.data?.total || 0);
        setTotalPage(res.data?.totalPage || 1);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };

  const resetSearch = () => {
    setPage(1);
    setSearch("");
    setSearchDate("");
  };

  const debounceSearch = useMemo(() => debounce(getData, 600), [getData]);
  useEffect(() => {
    if (!showModal) return;
    debounceSearch(search, searchDate, page);
  }, [search, searchDate, page, showModal]);

  const [deleting, setDeleting] = useState(false);
  const handleDelteThisHis = async (importId) => {
    const { isConfirmed } = await alerts.confirmDialog(
      "ยืนยันการลบประวัติการนำเข้า",
      "ประวัติการนำเข้าครั้งนี้จะถูกลบและไม่สามารถย้อนกลับได้",
    );
    if (!isConfirmed) return;
    setDeleting(true);
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI + `/president/delete-import-history/${importId}`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        alerts.success("ลบประวัติการนำเข้าครั้งนี้แล้ว");
        getData(search, searchDate, page);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setDeleting(false);
    }
  };
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 px-2.5 rounded-lg shadow-sm border border-gray-300 text-sm bg-white flex items-center gap-2"
      >
        <History size={18} />
        <p>ประวัติการนำเข้า</p>
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="z-50 w-full lg:w-1/2 p-5 rounded-lg bg-white flex flex-col">
          <div className="w-full pb-3 border-b border-gray-300 flex items-start justify-between">
            <div className="flex flex-col">
              <span className="flex items-center gap-2">
                <HistoryIcon className="text-blue-500" />
                <p>ประวัติการนำเข้าข้อมูลศิษย์เก่า</p>
              </span>
              <p className="text-sm text-gray-700">
                ตรวจสอบประวัติการนำเข้าข้อมูลศิษย์เก่าทั้งหมด
              </p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>
          <p className="mt-5 mb-1.5 text-sm text-gray-700">
            ค้นหาชื่อไฟล์และวันที่
          </p>
          <div className="flex flex-wrap gap-2">
            <div className="w-full lg:w-1/3">
              <SearchBox
                page={1}
                search={search}
                setPage={() => {}}
                setSearch={setSearch}
              />
            </div>

            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="p-2 text-sm px-2.5 rounded-lg border border-gray-300 shadow-sm "
            />
            <button
              onClick={resetSearch}
              className="p-2 px-2.5 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm flex items-center gap-2"
            >
              <RotateCcw size={18} />
              <p>ล้าง</p>
            </button>
            <PaginationBtn
              forwardPage={() => forwardPage(page, setPage, totalPage)}
              page={page}
              prevPage={() => prevPage(page, setPage)}
              totalPage={totalPage}
            />
          </div>
          <p className="mt-3.5 text-sm text-gray-700">พบ {total} รายการ</p>
          <div className="mt-2.5 w-full h-100 overflow-auto">
            <table className="min-w-max w-full">
              <thead>
                <tr className="shadow-sm sticky top-0 left-0">
                  <th className="p-2.5 pb-3 text-sm rounded-tl-lg font-normal text-start bg-blue-50">
                    ชื่อไฟล์
                  </th>
                  <th className="p-2.5 pb-3 text-sm font-normal text-start bg-blue-50">
                    จำนวนข้อมูล
                  </th>
                  <th className="p-2.5 pb-3 text-sm font-normal text-start bg-blue-50">
                    ผู้นำเข้า
                  </th>
                  <th className="p-2.5 pb-3 text-sm rounded-tr-lg font-normal text-start bg-blue-50">
                    วันที่
                  </th>
                  <th className="p-2.5 pb-3 text-sm rounded-tr-lg font-normal text-start bg-blue-50">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {load ? (
                  <RowLoader numcol={5} />
                ) : dataList.length < 1 ? (
                  <RowDataNotFound numCol={5} />
                ) : (
                  dataList.map((d, index) => (
                    <tr
                      key={index}
                      className="border-b text-sm border-gray-300 hover:bg-blue-50"
                    >
                      <td className="p-2.5">
                        <div className="flex items-center gap-2">
                          <p className="p-2 rounded-lg bg-blue-100 text-blue-600">
                            {" "}
                            <FileTerminalIcon size={16} />
                          </p>
                          <div className="flex flex-col">
                            <p>{d?.file_name}</p>
                            <p className="text-xs text-gray-500 font-semibold">
                              {formatFileSize(Number(d?.file_size || 0))}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-2.5">
                        <p className="text-blue-600">
                          {d?.total_rows?.toLocaleString("th-TH") || 0}
                        </p>
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-2">
                          <p className="p-2 rounded-lg bg-blue-100 text-blue-600">
                            {" "}
                            <User size={16} />
                          </p>
                          <p>
                            {d?.admin?.prefix}
                            {d?.admin?.fname} {d?.admin?.lname}
                          </p>
                        </div>
                      </td>
                      <td className="p-2.5">
                        <p>
                          {new Date(d?.created_at).toLocaleDateString("th-TH")}
                        </p>
                      </td>
                      <td className="p-2.5">
                        <DropdownMenu>
                          {
                            <>
                              <button
                                onClick={() => handleDelteThisHis(d?.id)}
                                disabled={deleting}
                                className="p-2 px-3 hover:bg-red-500 hover:text-white rounded-lg text-sm flex items-center gap-2"
                              >
                                {deleting ? (
                                  <>
                                    <Loader2 className="animate-spin" />
                                    <p>กำลังลบ...</p>
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    <Trash size={18} />
                                    <p>ลบประวัติครั้งนี้</p>
                                  </>
                                )}
                              </button>
                              {type === "alumni" && (
                                <DeleteAlumniFormImportHistoryBtn
                                  fetchData={() => {
                                    fetchAlumni();
                                    setShowModal(false);
                                  }}
                                  importData={d}
                                />
                              )}
                              {type === "personel" && (
                                <DeleteProfessorFormImportHistoryBtn
                                  fetchData={() => {
                                    fetchAlumni();
                                    setShowModal(false);
                                  }}
                                  importData={d}
                                />
                              )}
                            </>
                          }
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ImportHistoryData;
