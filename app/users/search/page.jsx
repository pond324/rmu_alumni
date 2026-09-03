"use client";
import {
  Book,
  Box,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  Eye,
  GraduationCap,
  List,
  MessageCircle,
  RotateCw,
  Search,
  Send,
  Table2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { alerts } from "@/libs/alerts";
import { debounce } from "lodash";
import Loading from "@/components/loading";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import Select from "@/components/select";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";
dayjs.locale("th");
dayjs.extend(relativeTime);
import { departmentText, facultyText } from "@/components/faculty-p";
import useGetSession from "@/hook/useGetSeesion";
import SendEmail from "@/components/sendEmail";
import { useAppContext } from "@/context/app.context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SelectYearEnd, SelectYearStart } from "@/components/select-year-start";
import { v4 as uuid } from "uuid";
import { useFacultyDep } from "@/hook/useFacultyDep";
import { SelectFaculty } from "@/components/select-fac-dep";
import SelectEduLevel from "@/components/select-edu-level";

const SearchPage = () => {
  const { departments, faculties } = useFacultyDep();
  const { user } = useGetSession();
  const [showSendEmail, setSendEmail] = useState(false);
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resultLenth, setResultLength] = useState("");
  const { setPrevPath } = useAppContext();
  const router = useRouter();
  const [selectEduLevel, setSelectEduLevel] = useState("");

  const [dataList, setDataList] = useState([]);
  const [sort, setSort] = useState(JSON.stringify({ year_start: "desc" }));
  const [take, setTake] = useState(10);
  const [selectYearStart, setSelectYearStart] = useState("");
  const [selectYearEnd, setSelectYearEnd] = useState("");
  const [type, setType] = useState(1);

  const fetchData = async (
    search = "",
    fac = "",
    dep = "",
    page = 1,
    sort,
    take,
    selectYearStart,
    selectYearEnd,
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/alumni/search-user", {
        withCredentials: true,
        params: {
          page,
          search,
          fac,
          dep,
          sort,
          take,
          selectYearStart,
          selectYearEnd,
        },
      });

      if (res.status === 200) {
        setDataList(res?.data?.data);
        setTotalPage(res?.data?.totalPage);
        setResultLength(res?.data?.all);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  const debounceSearch = useMemo(() => debounce(fetchData, 500), []);

  useEffect(() => {
    debounceSearch(
      search,
      faculty,
      department,
      page,
      sort,
      take,
      selectYearStart,
      selectYearEnd,
    );
  }, [
    search,
    faculty,
    department,
    page,
    sort,
    take,
    selectYearStart,
    selectYearEnd,
  ]);

  const resetSearch = () => {
    setSearch("");
    setFaculty("");
    setDepartment("");
    setPage(1);
    setSelectYearEnd("");
    setSelectYearStart("");
    setTake(10);
    setSelectEduLevel("");
  };

  const [sendToData, setSendToData] = useState();
  const handleShowSendEmail = (user) => {
    setSendEmail(true);
    setSendToData(user);
  };

  const [showAstTableFormat, setShowAsTableFormat] = useState(true);

  return (
    <>
      <div className="w-full flex flex-col p-3 sm:p-5 bg-gray-50 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 w-full border-b border-gray-300">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              ค้นหาศิษย์เก่า
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">
              ค้นหาและติดต่อกับศิษย์เก่า
            </p>
          </div>
        </div>

        {/* Filter Card */}
        <div className="bg-white mt-4 p-4 sm:p-5 w-full flex flex-col border border-gray-200 rounded-xl shadow-xs">
          <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <Search size={19} className="text-blue-600" />
              <p className="text-base sm:text-lg font-bold text-gray-800">
                ค้นหาและกรอง
              </p>
            </div>

            <button
              onClick={resetSearch}
              title="ล้างการค้นหา"
              className="flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-1.5 px-3 rounded-lg transition-colors"
            >
              <RotateCw size={14} />
              <span>ล้างตัวกรอง</span>
            </button>
          </div>

          {/* Primary Filter Row */}
          <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="h-[38px] px-3 bg-white rounded-lg border border-gray-300 shadow-xs flex items-center gap-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <Search size={17} className="text-gray-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                className="w-full text-sm bg-transparent outline-none"
                placeholder="พิมพ์ค้นหาชื่อ หรือข้อมูล..."
              />
            </div>

            <Select
              placeholder="เลือกคณะ"
              className="text-sm z-25"
              isClearable
              isSearchable
              options={faculties.map((f) => ({
                label: f.label ?? f.name ?? f.faculty_name,
                value: f.value ?? f.id ?? f.faculty_id,
              }))}
              value={
                faculties
                  .map((f) => ({
                    label: f.label ?? f.name ?? f.faculty_name,
                    value: f.value ?? f.id ?? f.faculty_id,
                  }))
                  .find((f) => String(f?.value) === String(faculty)) || null
              }
              onChange={(option) => {
                setFaculty(option ? option.value : "");
                setDepartment("");
              }}
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                  boxShadow: state.isFocused
                    ? "0 0 0 1px #3b82f6"
                    : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  "&:hover": {
                    borderColor: "#9ca3af",
                  },
                }),
                placeholder: (base) => ({
                  ...base,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "0.875rem",
                  color: "#6b7280",
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: "0 8px",
                }),
                indicatorsContainer: (base) => ({
                  ...base,
                  height: "38px",
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 50,
                  borderRadius: "8px",
                }),
              }}
            />

            <Select
              placeholder="เลือกสาขา"
              className="text-sm z-20"
              isClearable
              isSearchable
              options={departments
                .filter((d) => {
                  if (!faculty) return true;
                  const targetFac = String(faculty);
                  const facSub =
                    targetFac.length >= 2
                      ? targetFac.substring(1, 2)
                      : targetFac;
                  const depFacId = d.faculty_id ? String(d.faculty_id) : null;
                  const depIdStr = String(d.value ?? d.id ?? "");
                  return (
                    depFacId === targetFac ||
                    depIdStr.substring(0, 1) === facSub ||
                    depIdStr.startsWith(targetFac)
                  );
                })
                .map((d) => ({
                  label: d.label ?? d.name ?? d.department_name,
                  value: d.value ?? d.id ?? d.department_id,
                }))}
              value={
                departments
                  .map((d) => ({
                    label: d.label ?? d.name ?? d.department_name,
                    value: d.value ?? d.id ?? d.department_id,
                  }))
                  .find((f) => String(f.value) === String(department)) || null
              }
              onChange={(option) => setDepartment(option ? option.value : "")}
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                  boxShadow: state.isFocused
                    ? "0 0 0 1px #3b82f6"
                    : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  "&:hover": {
                    borderColor: "#9ca3af",
                  },
                }),
                placeholder: (base) => ({
                  ...base,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "0.875rem",
                  color: "#6b7280",
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: "0 8px",
                }),
                indicatorsContainer: (base) => ({
                  ...base,
                  height: "38px",
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 50,
                  borderRadius: "8px",
                }),
              }}
            />

            <SelectEduLevel
              selectEduLevel={selectEduLevel}
              setSelectEduLevel={setSelectEduLevel}
              width="w-full"
            />
          </div>

          {/* Secondary Controls Row */}
          <div className="mt-3.5 pt-3.5 border-t border-gray-100 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            {/* Search Sub-filters */}
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-gray-500">เมนูค้นหา</p>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={type}
                  disabled={user?.roleId <= 1}
                  onChange={(e) => setType(e.target.value)}
                  className="h-[38px] px-3 rounded-lg bg-white border border-gray-300 text-sm shadow-xs outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value={1}>ศิษย์เก่า</option>
                  <option value={2}>อาจารย์</option>
                </select>

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

                <div title="แสดงจำนวนแถว" className="relative">
                  <select
                    onChange={(e) => {
                      setTake(Number(e.target.value));
                      setPage(1);
                    }}
                    value={take}
                    id="search-take"
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
                    htmlFor="search-take"
                    className="h-[38px] px-3.5 rounded-lg border bg-white border-gray-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 text-gray-700 whitespace-nowrap transition-colors"
                  >
                    <List size={16} className="text-gray-500" />
                    <p className="text-sm">แสดง {take} แถว</p>
                  </label>
                </div>

                <div title="เรียงตาม" className="relative">
                  <select
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                    value={sort}
                    id="search-sort"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  >
                    <option
                      value={JSON.stringify({ year_start: "desc" })}
                      className="text-sm"
                    >
                      ปีที่เข้ารับการศึกษา (มากไปน้อย)
                    </option>
                    <option
                      value={JSON.stringify({ year_start: "asc" })}
                      className="text-sm"
                    >
                      ปีที่เข้ารับการศึกษา (น้อยไปมาก)
                    </option>
                    <option
                      value={JSON.stringify({ updatedAt: "desc" })}
                      className="text-sm"
                    >
                      อัปเดตล่าสุด
                    </option>
                  </select>
                  <label
                    htmlFor="search-sort"
                    className="h-[38px] px-3.5 rounded-lg border bg-white border-gray-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 text-gray-700 whitespace-nowrap transition-colors"
                  >
                    <ChevronsUpDown size={16} className="text-gray-500" />
                    <p className="text-sm">เรียง</p>
                  </label>
                </div>
              </div>
            </div>

            {/* View Mode Switcher */}
            <div className="flex flex-col gap-1.5 xl:items-end">
              <p className="text-xs font-medium text-gray-500">
                เลือกรูปแบบการแสดงผล
              </p>
              <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg border border-gray-200 self-start xl:self-auto">
                <button
                  type="button"
                  onClick={() => setShowAsTableFormat(true)}
                  className={`h-[32px] px-3 rounded-md text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
                    showAstTableFormat
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-gray-700 hover:bg-white/60"
                  }`}
                >
                  <Table2 size={16} />
                  <span>แสดงในรูปแบบตาราง</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAsTableFormat(false)}
                  className={`h-[32px] px-3 rounded-md text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
                    !showAstTableFormat
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-gray-700 hover:bg-white/60"
                  }`}
                >
                  <Box size={16} />
                  <span>แสดงในรูปแบบบล็อค</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info & Pagination */}
        <div className="w-full flex items-center justify-between flex-wrap gap-2 mt-5">
          <p className="font-bold text-sm text-gray-700">
            ผลการค้นหา ({loading ? "กำลังโหลด..." : `${resultLenth || 0} คน`})
          </p>
          {totalPage > 1 && (
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => {
                  setPage((prev) => Math.max(1, prev - 1));
                }}
                disabled={page <= 1}
                className={`p-1.5 px-2 rounded-lg border border-gray-300 flex items-center justify-center transition-colors ${
                  page <= 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-xs"
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-gray-700 font-medium px-2">
                หน้า {page} จาก {totalPage}
              </span>

              <button
                onClick={() => {
                  setPage((prev) => Math.min(totalPage, prev + 1));
                }}
                disabled={page >= totalPage}
                className={`p-1.5 px-2 rounded-lg border border-gray-300 flex items-center justify-center transition-colors ${
                  page >= totalPage
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-xs"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="w-full my-12 py-5 flex flex-col gap-2 items-center justify-center">
            <Loading type={2} />
            <p className="text-sm text-gray-500">กำลังโหลด...</p>
          </div>
        ) : dataList?.length > 0 ? (
          showAstTableFormat ? (
            <div className="w-full h-[600px] mt-3 rounded-xl border border-gray-200 bg-white overflow-x-auto shadow-xs overflow-y-auto">
              <table className="w-full min-w-[650px]">
                <thead className="sticky top-0 z-10 bg-blue-50 border-b border-gray-200">
                  <tr>
                    {[
                      "ที่",
                      "ชื่อ-นามสกุล",
                      "คณะ",
                      "สาขา",
                      "ปีการศึกษา (พ.ศ.)",
                      "แอ็คชัน",
                    ].map((h, i) => (
                      <th
                        key={i}
                        className="p-3 text-start text-xs sm:text-sm font-medium text-gray-700"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dataList.map((d, index) => (
                    <tr
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrevPath("/users/search");
                        router.push(`/users/search/${d?.alumni_id}/1`);
                      }}
                      key={d?.alumni_id || index}
                      className="text-sm hover:bg-blue-50/70 transition-colors duration-150 cursor-pointer"
                    >
                      <td className="p-3 text-gray-500 font-medium">
                        {index + (page - 1) * take + 1}
                      </td>
                      <td className="p-3 text-start font-medium text-gray-900">
                        {d?.prefix}
                        {d?.fname} {d?.lname}
                      </td>
                      <td className="p-3 text-start text-gray-600">
                        {facultyText(faculties, d?.facultyId)}
                      </td>
                      <td className="p-3 text-start text-gray-600">
                        {departmentText(departments, d?.departmentId)}
                      </td>
                      <td className="p-3 text-start text-gray-600">
                        {`${d?.year_start || "ไม่พบข้อมูล"} - ${
                          d?.year_end || "ไม่พบข้อมูล"
                        }`}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center">
                          {user?.id !== d?.alumni_id ? (
                            <button
                              title="ส่งข้อความ"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowSendEmail(d);
                              }}
                              className="p-2 px-3 border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 rounded-lg flex justify-center items-center shadow-xs transition-colors"
                            >
                              <MessageCircle size={15} color="white" />
                            </button>
                          ) : (
                            <Link
                              href="/users/profile"
                              title="โปรไฟล์ของฉัน"
                              className="p-2 px-3 border border-gray-300 hover:bg-yellow-100 text-gray-700 rounded-lg flex justify-center items-center shadow-xs transition-colors"
                            >
                              <Eye size={15} />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
              {dataList?.map((d, index) => (
                <div
                  key={d?.alumni_id || d?.professor_id || index}
                  className="relative p-4 rounded-xl border bg-white border-gray-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between gap-3"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs p-1 px-2.5 bg-blue-50 text-blue-700 font-medium rounded-full border border-blue-100">
                        {type > 1 ? d?.univercity_position : "ศิษย์เก่า"}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-gray-900">
                      {type < 2 ? d?.prefix : d?.academic_rank}
                      {d?.fname} {d?.lname}
                    </h2>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <GraduationCap
                          size={15}
                          className="text-gray-400 shrink-0"
                        />
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {facultyText(
                            faculties,
                            d?.facultyId || d?.alumni_id?.substring(3, 5),
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Book size={15} className="text-gray-400 shrink-0" />
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {departmentText(
                            departments,
                            d?.departmentId || d?.alumni_id?.substring(4, 8),
                          )}
                        </p>
                      </div>
                      {type < 2 && (
                        <>
                          <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
                            <Calendar
                              size={15}
                              className="text-gray-400 shrink-0"
                            />
                            <span>
                              ปีการศึกษา {d?.year_start || "-"} -{" "}
                              {d?.year_end || "-"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <Clock
                              size={14}
                              className="text-gray-400 shrink-0"
                            />
                            <span>
                              {d?.updatedAt
                                ? "อัปเดต " + dayjs(d?.updatedAt).fromNow()
                                : "ไม่มีการอัปเดตข้อมูล"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="w-full flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setPrevPath("/users/search");
                        router.push(
                          `/users/search/${
                            type < 2 ? d?.alumni_id : d?.professor_id
                          }/${type}`,
                        );
                      }}
                      className="flex-1 p-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 flex justify-center items-center gap-1.5 text-xs sm:text-sm font-medium transition-colors shadow-xs"
                    >
                      <Eye size={15} />
                      <span>ดูเพิ่มเติม</span>
                    </button>
                    {user?.id !==
                      (type < 2 ? d?.alumni_id : d?.professor_id) && (
                      <button
                        onClick={() => handleShowSendEmail(d)}
                        className="flex-1 p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex justify-center items-center gap-1.5 text-xs sm:text-sm font-medium transition-colors shadow-xs"
                      >
                        <MessageCircle size={15} color="white" />
                        <span>ส่งข้อความ</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="my-12 w-full text-center text-gray-500 text-base">
            ไม่พบข้อมูล
          </div>
        )}
      </div>

      <SendEmail
        sendToData={sendToData}
        show={showSendEmail}
        onclose={() => {
          setSendEmail(false);
        }}
      />
    </>
  );
};
export default SearchPage;
