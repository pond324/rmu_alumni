"use client";
import SearchBox from "@/components/search-box";
import { Building, Edit, FileSpreadsheet, Loader2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CreateEdit from "./create-edit-fac";
import { alerts } from "@/libs/alerts";
import RowLoader from "@/components/row-loader";
import RowDataNotFound from "@/components/row-data-notfound";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { debounce } from "lodash";
import PaginationBtn from "@/components/pageination-btn";
import { forwardPage, prevPage } from "@/libs/pagination-helper";
import DepartmentManage from "./department-manage";
import EduLevelManage from "./edu-level-manage";

const FacdepSetting = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [facultyList, setFacultyList] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [load, setLoad] = useState(true);

  const [edit, setEdit] = useState(null);
  const handleEdit = (fac) => setEdit(fac);

  const getFacList = async (search, page) => {
    setLoad(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-facultys",
        { params: { search, page } },
      );
      if (res.status === 200) {
        setFacultyList(res.data.data || []);
        setTotal(res.data.total || 0);
        setTotalPage(res?.data?.totalPage || 1);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async (id) => {
    const { isConfirmed } = await alerts.confirmDialog(
      "ยืนยันลบข้อมูล",
      "คุณต้องการลบข้อมูลคณะนี้หรือไม่?",
      "ลบ",
    );
    if (!isConfirmed) return;
    setDeleting(true);
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI + `/president/delete-fac/${id}`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        alerts.success("ลบข้อมูลสำเร็จ");
        getFacList(search, page);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setDeleting(false);
    }
  };

  const debounceSearch = useMemo(() => debounce(getFacList, 600), [getFacList]);
  useEffect(() => {
    debounceSearch(search, page);
  }, [search, page]);

  return (
    <div className="p-5 w-full flex flex-col">
      <div className="w-full p-3.5 bg-white rounded-tl-lg rounded-tr-lg border border-gray-200 flex flex-col">
        <span className="flex items-center gap-3.5">
          <p className="p-2.5 rounded-lg bg-blue-100 text-blue-600 w-fit">
            <Building />
          </p>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold">จัดการข้อมูลคณะ</p>
            <p className="text-xs text-gray-700">
              จัดการข้อมูลคณะ เพิ่ม ลบและแก้ไขข้อมูล
            </p>
          </div>
        </span>
      </div>
      <div className="w-full rounded-bl-lg rounded-br-lg border bg-white border-gray-200 border-t-0 flex flex-col p-5">
        <p className="text-sm text-gray-600">รายการคณะ ({total} คณะ)</p>
        <div className="mt-1 w-full flex items-center gap-2 flex-wrap ">
          <div className="w-full lg:w-1/2">
            <SearchBox
              page={page}
              search={search}
              setPage={setPage}
              setSearch={setSearch}
            />
          </div>
          <CreateEdit
            faculty_id={edit}
            fetch={() => getFacList(search, page)}
            setFac={setEdit}
          />
          <PaginationBtn
            forwardPage={() => forwardPage(page, setPage, totalPage)}
            page={page}
            prevPage={() => prevPage(page, setPage)}
            totalPage={totalPage}
          />
        </div>

        <div className="mt-3.5 w-full h-100 overflow-auto">
          <table className="min-w-max w-full ">
            <thead>
              <tr className="border-b border-gray-300 sticky top-0">
                <td className="p-2.5 rounded-tl-lg pb-3 text-sm font-normal bg-blue-50">
                  รหัสคณะ
                </td>
                <td className="p-2.5 pb-3 text-sm font-normal bg-blue-50">
                  ชื่อคณะ
                </td>
                <td className="p-2.5 rounded-tr-lg pb-3 text-sm font-normal bg-blue-50">
                  จัดการ
                </td>
              </tr>
            </thead>
            <tbody>
              {load ? (
                <RowLoader numcol={3} />
              ) : facultyList.length < 1 ? (
                <RowDataNotFound numCol={3} />
              ) : (
                facultyList.map((f, index) => (
                  <tr
                    className="border-b border-gray-300 hover:bg-gray-50"
                    key={index}
                  >
                    <td className="p-2.5 pb-3">
                      <p className="text-sm">{f?.faculty_id}</p>
                    </td>
                    <td className="p-2.5 pb-3">
                      <p className="text-sm">{f?.faculty_name}</p>
                    </td>
                    <td className="p-2.5 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleEdit(f)}
                          className="p-1.5 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg bg-gray-50 shadow-sm"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          disabled={deleting}
                          onClick={() => handleDelete(f?.faculty_id)}
                          className="p-1.5 text-red-500 hover:bg-red-500 hover:text-white rounded-lg bg-gray-50 shadow-sm"
                        >
                          {deleting ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DepartmentManage />

      <EduLevelManage />
    </div>
  );
};
export default FacdepSetting;
