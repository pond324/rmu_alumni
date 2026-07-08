"use client";
import {
  ArrowLeft,
  ChevronsUpDown,
  List,
  RotateCcw,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ExportBtn from "./export-btn";
import { useDashboardContext } from "@/app/users/dashboard/dashboard-context";
import { usePathname, useRouter } from "next/navigation";
import { debounce } from "lodash";
import useGetSession from "@/hook/useGetSeesion";
import { useAppContext } from "@/context/app.context";
import { SelectYearEnd, SelectYearStart } from "./select-year-start";
import ImportAlumniData from "../app/alumni-president/alumni-manage/import-alumni-data";
import { useFacultyDep } from "@/hook/useFacultyDep";
import PaginationBtn from "./pageination-btn";
import { SelectDepartment, SelectFaculty } from "./select-fac-dep";
import ImportHistoryData from "@/app/alumni-president/alumni-manage/import-history-btn";
import ExportDataSelection from "./export-data-selection";
import ExportAlumniData from "@/app/alumni-president/alumni-manage/export-alumni-data";
import SelectEduLevel from "./select-edu-level";

const TablePage = ({
  header,
  children,
  theads,
  fetchData,
  exportData,
  totalPage,
  total,
  filterBtn,
  // ✅ state มาจาก parent
  page,
  setPage,
  take,
  setTake,
  sort,
  setSort,
  search,
  setSearch,
  facultyId,
  setFacultyId,
  departmentId,
  setDepartmentId,
  setSelectYearStart,
  setSelectYearEnd,
  selectYearStart,
  selectYearEnd,
  extraFilter = {},
  setExtraFilter,
  showExportBtn = true, // ✅ optional filter,
  selectEduLevel,
  setSelectEduLevel,
}) => {
  const pathName = usePathname();
  const { user } = useGetSession();
  const { faculties, departments, loadData } = useFacultyDep();
  const { faculty, department, setFaculty, setDepartment } =
    useDashboardContext();
  const { setPrevPath } = useAppContext();

  const router = useRouter();
  const [description, setDescription] = useState("");

  const debounceSearch = useMemo(() => debounce(fetchData, 700), [fetchData]);

  useEffect(() => {
    let desc = "ภายใน";
    if (facultyId) {
      const facultyName = faculties.find((f) => f.id === facultyId)?.name;
      desc += facultyName ? ` ${facultyName}` : "";
    }
    if (departmentId) {
      const departmentName = departments.find(
        (d) => d.id === departmentId,
      )?.name;
      desc += departmentName ? ` ${departmentName}` : "";
    }
    desc += " มหาวิทยาลัยราชภัฏมหาสารคาม";
    setDescription(desc);
  }, [faculty, department, facultyId, departmentId]);

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
    setSort(JSON.stringify({ year_start: "desc" }));
    setExtraFilter({});
    setSelectYearEnd("");
    setSelectYearStart("");
    setSelectEduLevel("");
  };

  // ✅ โหลดข้อมูลทุกครั้งที่ state เปลี่ยน
  useEffect(() => {
    debounceSearch(
      page,
      take,
      search,
      facultyId,
      departmentId,
      sort,
      selectYearStart,
      selectYearEnd,
      extraFilter,
      selectEduLevel,
    );
  }, [
    page,
    take,
    search,
    facultyId,
    departmentId,
    sort,
    extraFilter,
    selectYearEnd,
    selectYearStart,
    selectEduLevel,
  ]);
  return (
    <>
      <div className="w-full h-auto items-start flex flex-col bg-gray-50 px-5 py-3">
        {user?.roleId < 5 && (
          <button
            onClick={() => {
              setFaculty(null);
              setDepartment(null);
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
            <h1 className="font-bold text-lg">{header}</h1>
            <p className="text-[0.9rem] text-gray-700">
              {description +
                `${selectYearStart ? ` ปีการศึกษา พ.ศ. ${selectYearStart}` : ""}
            ${
              selectYearEnd && selectYearStart
                ? ` - พ.ศ. ${selectYearEnd}`
                : selectYearEnd
                  ? ` ปีที่สำเร็จการศึกษา พ.ศ. ${selectYearEnd}`
                  : ""
            }`}{" "}
              ({total} คน)
            </p>
          </div>
          {pathName === "/alumni-president/alumni-manage" && (
            <div className="flex items-center gap-2.5">
              <ImportAlumniData fetchData={fetchData} />
              <ImportHistoryData fetchAlumni={fetchData} />
              <ExportAlumniData />
            </div>
          )}
        </span>

        <div className="gap-2.5 w-full flex-wrap flex items-center my-2.5">
          <div className="lg:w-1/6 w-full md:w-1/3 bg-white col-span-5 p-2 px-3 rounded-lg border border-gray-300 shadow-sm flex items-center gap-2">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (page > 1) {
                  setPage(1);
                }
              }}
              type="text"
              placeholder="พิมพ์ค้นหา"
              className="text-[0.9rem] w-[90%]"
            />
          </div>
          {user?.roleId > 3 && (
            <SelectFaculty
              facultyId={facultyId}
              loadData={loadData}
              setDepartmentId={setDepartmentId}
              setFacultyId={setFacultyId}
              setFaculty={setFaculty}
            />
          )}
          {user?.roleId > 2 && (
            <SelectDepartment
              departmentId={departmentId}
              faculty={faculty}
              facultyId={facultyId}
              loadData={loadData}
              setDepartmentId={setDepartmentId}
            />
          )}
          <SelectEduLevel
            selectEduLevel={selectEduLevel}
            setSelectEduLevel={setSelectEduLevel}
          />
          <SelectYearStart
            setSelectYearStart={setSelectYearStart}
            selectYearStart={selectYearStart}
            setPage={setPage}
          />
          <SelectYearEnd
            setSelectYearEnd={setSelectYearEnd}
            selectYearEnd={selectYearEnd}
            setPage={setPage}
          />

          {filterBtn}

          <div
            title="เลือกจำนวนที่ต้องการแสดง"
            className="relative inline-block"
          >
            <select
              onChange={(e) => {
                setTake(Number(e.target.value));
                setPage(1);
              }}
              value={take}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
              htmlFor="select-row"
              className="p-2 px-3.5 rounded-lg border bg-white border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <List size={17} />
              <p className="text-sm ">แสดง {take} แถว</p>
            </label>
          </div>

          <div title="เรียงตาม" className="relative inline-block">
            <select
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              value={sort}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              <option
                value={JSON.stringify({ year_start: "desc" })}
                className="text-sm"
              >
                ปีที่การศึกษาปัจจุบัน
              </option>
              <option
                value={JSON.stringify({ year_start: "asc" })}
                className="text-sm"
              >
                ปีที่การศึกษาอดีต
              </option>
            </select>
            <label
              htmlFor="select-row"
              className="p-2 px-3.5 rounded-lg bg-white border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ChevronsUpDown size={17} />
              <p className="text-sm ">เรียง</p>
            </label>
          </div>
          <button
            title="ล้างการค้นหา"
            onClick={resetData}
            className="p-2 bg-white px-3.5 justify-center rounded-lg border border-gray-300 shadow-md flex items-center gap-2"
          >
            <RotateCcw size={17} />
            <p className="text-sm ">ล้างการค้นหา</p>
          </button>
          {totalPage > 1 && (
            <PaginationBtn
              forwardPage={forwardPage}
              page={page}
              totalPage={totalPage}
              prevPage={prevPage}
            />
          )}
        </div>

        <div className="w-full rounded-tl-lg rounded-tr-lg overflow-x-auto h-[600px] bg-white overflow-y-auto pb-3">
          <table className="min-w-max w-full">
            <thead>
              <tr className="sticky top-0 bg-white z-10">
                {["ชื่อ - นามสกุล", "คณะ/สาขา", "ปีการศึกษา (พ.ศ.)"].map(
                  (h, index) => (
                    <th
                      key={index}
                      className={`text-start p-2.5 text-[0.9rem] bg-sky-100 font-normal`}
                    >
                      {h}
                    </th>
                  ),
                )}
                {theads?.map((t, index) => (
                  <th
                    className="text-start p-2.5 text-[0.9rem] bg-sky-100 font-normal"
                    key={index}
                  >
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">{children}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default TablePage;
