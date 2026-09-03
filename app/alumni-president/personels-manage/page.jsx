"use client";
import {
  ArrowLeft,
  ChevronsUpDown,
  Eye,
  Filter,
  List,
  RotateCcw,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import useGetSession from "@/hook/useGetSeesion";
import { useAppContext } from "@/context/app.context";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { v4 as uuid } from "uuid";
import { departmentText, facultyText } from "@/components/faculty-p";
import ToggleAccoutStatus from "@/components/toggle-account-status";
import { useFacultyDep } from "@/hook/useFacultyDep";
import ImportPersonelData from "./import-personel-data";
import { SelectDepartment, SelectFaculty } from "@/components/select-fac-dep";
import RowLoader from "@/components/row-loader";
import RowDataNotFound from "@/components/row-data-notfound";
import PaginationBtn from "@/components/pageination-btn";
import DropdownMenu from "@/components/dropdown";
import ViewProfessorDataBtn from "./view-professor-data-btn";
import ImportHistoryData from "../alumni-manage/import-history-btn";
import ExportPersonelBtn from "./export-personel-btn";
import DeletePersonelBtn from "./delete-personel.-btn";

const displayFilterText = (data) => {
  return data ? JSON.parse(data)?.univercity_position : "ทุกตำแหน่ง";
};

const TablePage = () => {
  const { departments, faculties, loadData } = useFacultyDep();
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState();
  const [total, setTotal] = useState(0);

  // ✅ ควบคุม pagination/filter state ที่นี่ (parent)
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(25);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(JSON.stringify({ createdAt: "desc" }));
  const [facultyId, setFacultyId] = useState("");
  const [faculty, setFaculty] = useState(null);
  const [departmentId, setDepartmentId] = useState("");
  const [filter, setFilter] = useState(null);
  const { user } = useGetSession();
  const { setPrevPath } = useAppContext();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const fetchData = async (
    page,
    take,
    search,
    facultyId,
    departmentId,
    sort,
    filter,
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/president/get-user", {
        withCredentials: true,
        params: {
          page,
          take,
          search,
          facultyId,
          departmentId,
          sort,
          filter,
        },
      });
      if (res.status === 200) {
        setData(res.data?.data);
        setTotal(res.data.total);
        setTotalPage(res.data.totalPage);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  const debounceSearch = useMemo(() => debounce(fetchData, 500), [fetchData]);

  const forwardPage = () => {
    if (page >= totalPage) return;
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page <= 1) return;
    setPage(page - 1);
  };

  const resetData = () => {
    setFacultyId(user?.roleId <= 3 ? `${user?.facultyId}` : "");
    setDepartmentId(user?.roleId < 3 ? `${user?.departmentId}` : "");
    setSearch("");
    setPage(1);
    setFilter(null);
    setSort(JSON.stringify({ createdAt: "desc" }));
  };

  // ✅ โหลดข้อมูลทุกครั้งที่ state เปลี่ยน
  useEffect(() => {
    debounceSearch(page, take, search, facultyId, departmentId, sort, filter);
  }, [page, take, search, facultyId, departmentId, sort, filter]);
  return (
    <div className="w-full flex flex-col bg-gray-50">
      <div className="w-full items-start flex flex-col px-5 pt-3">
        {user?.roleId < 5 && (
          <button
            onClick={() => {
              setPrevPath("");
              router.push("/users/dashboard");
            }}
            className="w-fit flex items-center gap-2"
          >
            <ArrowLeft size={20} color="blue" />
          </button>
        )}

        <span className="w-full flex flex-col lg:flex-row lg:items-end gap-2 justify-between lg:border-b lg:pb-3 lg:border-gray-300">
          <div className="flex flex-col mt-2">
            <h1 className="font-bold text-lg">จัดการบุคลากร</h1>
            <p className="text-[0.9rem] text-gray-700">
              ผลการค้นหาบุคลากรทั้งหมด ({total} คน)
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* <ImportPersonelData
              fetchData={() =>
                fetchData(
                  page,
                  take,
                  search,
                  facultyId,
                  departmentId,
                  sort,
                  filter,
                )
              }
            />
            <ImportHistoryData
              fetchAlumni={() =>
                fetchData(
                  page,
                  take,
                  search,
                  facultyId,
                  departmentId,
                  sort,
                  filter,
                )
              }
              type="personel"
            /> */}
            <ExportPersonelBtn />
          </div>
        </span>

        <div className="w-full flex flex-wrap items-center gap-2.5 my-3">
          {/* Search Box */}
          <div className="flex-1 min-w-[200px] sm:min-w-[240px] max-w-full sm:max-w-xs h-[38px] px-3 bg-white rounded-lg border border-gray-300 shadow-xs flex items-center gap-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <Search size={17} className="text-gray-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (page > 1) {
                  setPage(1);
                }
              }}
              type="text"
              placeholder="พิมพ์ค้นหาชื่อ หรือข้อมูลบุคลากร"
              className="text-sm w-full bg-transparent outline-none"
            />
          </div>

          {/* Faculty Dropdown */}
          {user?.roleId > 3 && (
            <div className="w-full sm:w-[200px] md:w-[220px]">
              <SelectFaculty
                facultyId={facultyId}
                loadData={loadData}
                setDepartmentId={setDepartmentId}
                setFacultyId={setFacultyId}
                setFaculty={setFaculty}
                width="w-full"
              />
            </div>
          )}

          {/* Department Dropdown */}
          {user?.roleId > 2 && (
            <div className="w-full sm:w-[200px] md:w-[220px]">
              <SelectDepartment
                departmentId={departmentId}
                faculty={faculty}
                facultyId={facultyId}
                loadData={loadData}
                setDepartmentId={setDepartmentId}
                width="w-full"
              />
            </div>
          )}

          {/* Position Filter */}
          <div title="กรองตามตำแหน่ง" className="relative">
            <select
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              value={filter || ""}
              id="select-position"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            >
              <option value="" className="text-sm">
                ทุกตำแหน่ง
              </option>
              <option
                value={JSON.stringify({
                  univercity_position: "อาจารย์",
                })}
                className="text-sm"
              >
                อาจารย์
              </option>
              <option
                value={JSON.stringify({
                  univercity_position: "รองคณบดี",
                })}
                className="text-sm"
              >
                รองคณบดี
              </option>
              <option
                value={JSON.stringify({
                  univercity_position: "คณบดี",
                })}
                className="text-sm"
              >
                คณบดี
              </option>
              <option
                value={JSON.stringify({
                  univercity_position: "รองอธิการบดี",
                })}
                className="text-sm"
              >
                รองอธิการบดี
              </option>
              <option
                value={JSON.stringify({
                  univercity_position: "อธิการบดี",
                })}
                className="text-sm"
              >
                อธิการบดี
              </option>
            </select>

            <label
              htmlFor="select-position"
              className="h-[38px] px-3.5 rounded-lg bg-white border border-gray-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 text-gray-700 whitespace-nowrap transition-colors"
            >
              <Filter size={16} className="text-gray-500" />
              <p className="text-sm">{displayFilterText(filter)}</p>
            </label>
          </div>

          {/* Rows per page */}
          <div
            title="เลือกจำนวนที่ต้องการแสดง"
            className="relative"
          >
            <select
              onChange={(e) => {
                setTake(Number(e.target.value));
                setPage(1);
              }}
              value={take}
              id="select-take"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            >
              <option value={10} className="text-sm">
                10
              </option>
              <option value={25} className="text-sm">
                25
              </option>
              <option value={50} className="text-sm">
                50
              </option>
              <option value={100} className="text-sm">
                100
              </option>
            </select>
            <label
              htmlFor="select-take"
              className="h-[38px] px-3.5 rounded-lg border bg-white border-gray-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 text-gray-700 whitespace-nowrap transition-colors"
            >
              <List size={16} className="text-gray-500" />
              <p className="text-sm">แสดง {take} แถว</p>
            </label>
          </div>

          {/* Sort */}
          <div title="เรียงตาม" className="relative">
            <select
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              value={sort}
              id="select-sort"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            >
              <option
                value={JSON.stringify({ createdAt: "desc" })}
                className="text-sm"
              >
                เพิ่มล่าสุด
              </option>
              <option
                value={JSON.stringify({ updatedAt: "desc" })}
                className="text-sm"
              >
                แก้ไขล่าสุด
              </option>
            </select>
            <label
              htmlFor="select-sort"
              className="h-[38px] px-3.5 rounded-lg border bg-white border-gray-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 text-gray-700 whitespace-nowrap transition-colors"
            >
              <ChevronsUpDown size={16} className="text-gray-500" />
              <p className="text-sm">เรียง</p>
            </label>
          </div>

          {/* Reset */}
          <button
            type="button"
            title="ล้างการค้นหา"
            onClick={resetData}
            className="h-[38px] px-3.5 justify-center bg-white rounded-lg border border-gray-300 shadow-xs flex items-center gap-2 hover:bg-gray-50 text-gray-700 whitespace-nowrap transition-colors"
          >
            <RotateCcw size={16} className="text-gray-500" />
            <p className="text-sm">ล้าง</p>
          </button>

          {/* Pagination */}
          <div className="ml-auto flex items-center">
            <PaginationBtn
              forwardPage={forwardPage}
              page={page}
              prevPage={prevPage}
              totalPage={totalPage}
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto bg-white h-[600px] overflow-y-auto rounded-tl pb-3">
          <table className="min-w-max w-full">
            <thead>
              <tr className="sticky top-0 bg-white z-10">
                {[
                  "ชื่อ - นามสกุล",
                  "คณะ",
                  "สาขา",
                  "ตำแหน่ง",
                  "วันที่นำเข้าข้อมูล",
                  "สถานะบัญชี",
                  "จัดการ",
                ].map((h, index) => (
                  <th
                    key={index}
                    className="text-start p-2.5 text-[0.9rem] bg-sky-100 font-normal"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <RowLoader numcol={7} />
              ) : data.length > 0 ? (
                data.map((d, index) => (
                  <tr
                    key={uuid()}
                    className="text-sm bg-white cursor-pointer border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-2.5">
                      {d?.univercity_position === "อาจารย์"
                        ? d?.prefix
                        : d?.academic_rank}
                      {d?.fname} {d?.lname}
                    </td>
                    <td className="p-2.5">
                      {facultyText(faculties, d?.facultyId)}
                    </td>
                    <td className="p-2.5">
                      {departmentText(departments, d?.departmentId)}
                    </td>
                    <td className="p-2.5">{d?.univercity_position}</td>
                    <td className="p-2.5">
                      <p className="p-1.5 w-fit px-2 rounded-full bg-blue-50 shadow-xs text-xs">
                        {" "}
                        {new Date(d?.createdAt).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td className="p-2.5">
                      <ToggleAccoutStatus
                        canUse={d?.canUse}
                        fetchData={() =>
                          fetchData(
                            page,
                            take,
                            search,
                            facultyId,
                            departmentId,
                            sort,
                            filter,
                          )
                        }
                        user_id={d?.professor_id}
                        role={2}
                      />
                    </td>
                    <td className="p-2.5">
                      <DropdownMenu>
                        <>
                          <ViewProfessorDataBtn
                            fetchData={() =>
                              fetchData(
                                page,
                                take,
                                search,
                                facultyId,
                                departmentId,
                                sort,
                                filter,
                              )
                            }
                            user_id={d?.professor_id}
                          />
                          <DeletePersonelBtn
                            professor_id={d?.professor_id}
                            fetch={() =>
                              fetchData(
                                page,
                                take,
                                search,
                                facultyId,
                                departmentId,
                                sort,
                                filter,
                              )
                            }
                          />
                        </>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <RowDataNotFound numCol={7} />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default TablePage;
