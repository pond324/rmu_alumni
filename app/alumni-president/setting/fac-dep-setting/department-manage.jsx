"use client";
import SearchBox from "@/components/search-box";
import {
  Book,
  Building,
  Edit,
  FileSpreadsheet,
  Loader2,
  RotateCw,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { alerts } from "@/libs/alerts";
import RowLoader from "@/components/row-loader";
import RowDataNotFound from "@/components/row-data-notfound";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { debounce } from "lodash";
import PaginationBtn from "@/components/pageination-btn";
import { forwardPage, prevPage } from "@/libs/pagination-helper";
import CreateEditDepartments from "./create-edit-department";
import { SelectFaculty } from "@/components/select-fac-dep";

const DepartmentManage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [departmentList, setdepartmentList] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [load, setLoad] = useState(true);
  const [selectFacultyId, setSelectFacultyId] = useState(null);

  const [edit, setEdit] = useState(null);
  const handleEdit = (fac) => setEdit(fac);

  const getDepList = async (search, page, selectFacultyId) => {
    setLoad(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-departments",
        { params: { search, page, selectFacultyId } },
      );
      if (res.status === 200) {
        setdepartmentList(res.data.data || []);
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
      "คุณต้องการลบข้อมูลสาขาวิชานี้หรือไม่?",
      "ลบ",
    );
    if (!isConfirmed) return;
    setDeleting(true);
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI + `/president/delete-dep/${id}`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        alerts.success("ลบข้อมูลสำเร็จ");
        getDepList(search, page);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setDeleting(false);
    }
  };

  const debounceSearch = useMemo(() => debounce(getDepList, 600), [getDepList]);
  useEffect(() => {
    debounceSearch(search, page, selectFacultyId);
  }, [search, page, selectFacultyId]);

  return (
    <>
      <div className="w-full p-3.5 mt-5 bg-white rounded-tl-lg rounded-tr-lg border border-gray-200 flex flex-col">
        <span className="flex items-center gap-3.5">
          <p className="p-2.5 rounded-lg bg-blue-100 text-blue-600 w-fit">
            <Book />
          </p>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold">จัดการข้อมูลสาขาวิชา</p>
            <p className="text-xs text-gray-700">
              จัดการข้อมูลสาขาวิชา เพิ่ม ลบและแก้ไขข้อมูล
            </p>
          </div>
        </span>
      </div>
      <div className="w-full rounded-bl-lg rounded-br-lg border bg-white border-gray-200 border-t-0 flex flex-col p-5">
        <p className="text-sm text-gray-600">
          รายการสาขาวิชา ({total} สาขาวิชา)
        </p>
        <div className="mt-1 w-full flex items-center gap-2 flex-wrap ">
          <div className="w-full lg:w-1/3">
            <SearchBox
              page={page}
              search={search}
              setPage={setPage}
              setSearch={setSearch}
            />
          </div>
          <SelectFaculty
            facultyId={selectFacultyId}
            setDepartmentId={() => {}}
            setFacultyId={setSelectFacultyId}
            setFaculty={() => {}}
          />
          <CreateEditDepartments
            department_id={edit}
            fetch={() => getDepList(search, page)}
            setDep={setEdit}
          />
          <button onClick={() => {
            setSearch("");
            setSelectFacultyId("");
          }} className="p-2 px-3 flex shadow-sm items-center gap-2 rounded-lg text-sm bg-gray-50">
            <RotateCw size={18} />
            <p>ล้างการค้นหา</p>
          </button>
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
                  คณะ
                </td>
                <td className="p-2.5 rounded-tl-lg pb-3 text-sm font-normal bg-blue-50">
                  รหัสสาขาวิชา
                </td>
                <td className="p-2.5 pb-3 text-sm font-normal bg-blue-50">
                  ชื่อสาขาวิชา
                </td>
                <td className="p-2.5 rounded-tr-lg pb-3 text-sm font-normal bg-blue-50">
                  จัดการ
                </td>
              </tr>
            </thead>
            <tbody>
              {load ? (
                <RowLoader numcol={4} />
              ) : departmentList.length < 1 ? (
                <RowDataNotFound numCol={4} />
              ) : (
                departmentList.map((f, index) => (
                  <tr
                    className="border-b border-gray-300 hover:bg-gray-50"
                    key={index}
                  >
                    <td className="p-2.5 pb-3">
                      <p className="text-sm">{f?.faculty?.faculty_name}</p>
                    </td>
                    <td className="p-2.5 pb-3">
                      <p className="text-sm">{f?.department_id}</p>
                    </td>
                    <td className="p-2.5 pb-3">
                      <p className="text-sm">{f?.department_name}</p>
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
                          onClick={() => handleDelete(f?.department_id)}
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
    </>
  );
};
export default DepartmentManage;
