"use client";
import EditSlipRegis from "@/components/edit-slip-regis";
import { departmentText, facultyText } from "@/components/faculty-p";
import FadeInSection from "@/components/fade-in-section";
import NoDataFound from "@/components/no-data-found";
import PaginationBtn from "@/components/pageination-btn";
import RowDataNotFound from "@/components/row-data-notfound";
import RowLoader from "@/components/row-loader";
import { SelectYearEnd, SelectYearStart } from "@/components/select-year-start";
import { apiConfig } from "@/config/api.config";
import { useFacultyDep } from "@/hook/useFacultyDep";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { debounce } from "lodash";
import {
  Building,
  Calendar,
  CheckCircle,
  ChevronsUpDown,
  Clock,
  FileText,
  FolderOpen,
  IdCard,
  List,
  ListRestart,
  Loader2,
  Search,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ManageBtn from "./manage-btn";
import { SelectDepartment, SelectFaculty } from "@/components/select-fac-dep";
import ExportRegisAlumniBtn from "./export-btn";

const ManageAlumniRegis = () => {
  const { departments, faculties, loadData } = useFacultyDep();
  const [regisStatus, setRegisStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [facultyId, setFacultyId] = useState("");
  const [departmentId, setDepartmentId] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [selectYearStart, setSelectYearStart] = useState("");
  const [selectYearEnd, setSelectYearEnd] = useState("");
  const [sort, setSort] = useState(JSON.stringify({ year_start: "desc" }));
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const forwardPage = () => {
    if (page < totalPage) {
      setPage(page + 1);
    }
  };
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const [take, setTake] = useState(10);

  const [regisAlumniList, setRegisAlumniList] = useState([]);
  const [load, setLoad] = useState(true);
  const getRegisAlumniList = async (
    facultyId,
    search,
    departmentId,
    selectYearStart,
    selectYearEnd,
    take,
    sort,
    page,
    regis_status,
  ) => {
    setLoad(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/alumni/regis-alumni-list",
        {
          params: {
            facultyId,
            search,
            departmentId,
            selectYearStart,
            selectYearEnd,
            take,
            sort,
            page,
            regis_status,
          },
        },
      );
      if (res.status === 200) {
        setRegisAlumniList(res.data.data || []);
        // console.log("🚀 ~ getRegisAlumniList ~ res.data.data:", res.data.data)
        setTotal(res.data.total || 0);
        setTotalPage(res.data.totalPage || 1);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };
  const debounceSearch = useMemo(
    () => debounce(getRegisAlumniList, 500),
    [getRegisAlumniList],
  );
  useEffect(() => {
    debounceSearch(
      facultyId,
      search,
      departmentId,
      selectYearStart,
      selectYearEnd,
      take,
      sort,
      page,
      regisStatus,
    );
  }, [
    facultyId,
    search,
    departmentId,
    selectYearStart,
    selectYearEnd,
    take,
    sort,
    page,
    regisStatus,
  ]);

  const resetSearch = () => {
    setSearch("");
    setFacultyId("");
    setDepartmentId("");
    setSelectYearStart("");
    setSelectYearEnd("");
    setTake(10);
    setSort(JSON.stringify({ year_start: "desc" }));
    setPage(1);
  };

  const [stats, setStats] = useState(null);
  const [loadStat, setLoadStat] = useState(true);
  const getStats = async () => {
    setLoadStat(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/alumni-regis-status-stats",
        { withCredentials: true },
      );
      if (res.status === 200) {
        setStats(res.data);
      }
    } catch (error) {
      console.error(error);
      alerts.err;
    } finally {
      setLoadStat(false);
    }
  };
  useEffect(() => {
    getStats();
  }, []);

  return (
    <div className="w-full flex flex-col px-5 bg-gray-50">
      <div className="w-full flex items-center justify-between">
        <span className="flex flex-col">
          <p className="text-xl font-bold">ตรวจสอบการลงทะเบียนศิษย์เก่า</p>
          <p className="text-gray-600 text-sm">
            ตรวจสอบหลักฐานการชำระเงิน อนุมัติ หรือปฏิเสธคำขอลงทะเบียน
          </p>
        </span>
        <ExportRegisAlumniBtn />
      </div>

      {/* stats */}
      <div className="w-full mt-5 grid md:grid-cols-2 lg:grid-cols-6 gap-3.5">
        <FadeInSection
          className={
            "p-3.5 bg-white rounded-lg border border-gray-300 shadow-sm flex items-center gap-5"
          }
        >
          <p className="p-2 rounded-lg bg-blue-50 text-blue-500">
            <Users />
          </p>
          <span className="flex flex-col">
            <p className="text-sm text-gray-500">นักศึกษาทั้งหมด</p>
            {loadStat ? (
              <Loader2
                size={25}
                className="animate-spin mt-1.5 text-blue-500"
              />
            ) : (
              <p className="text-2xl font-bold">
                {Number(stats?.stds).toLocaleString() || 0}
              </p>
            )}
          </span>
        </FadeInSection>
        <FadeInSection
          className={
            "p-3.5 bg-white rounded-lg border border-gray-300 shadow-sm flex items-center gap-5"
          }
        >
          <p className="p-2 rounded-lg bg-gray-50 text-gray-500">
            <FolderOpen />
          </p>
          <span className="flex flex-col">
            <p className="text-sm text-gray-500">ยังไม่ลงทะเบียน</p>
            {loadStat ? (
              <Loader2
                size={25}
                className="animate-spin mt-1.5 text-blue-500"
              />
            ) : (
              <p className="text-2xl font-bold">
                {Number(stats?.no_regis).toLocaleString() || 0}
              </p>
            )}
          </span>
        </FadeInSection>
        <FadeInSection
          className={
            "p-3.5 bg-white rounded-lg border border-gray-300 shadow-sm flex items-center gap-5"
          }
        >
          <p className="p-2 rounded-lg bg-blue-50 text-blue-500">
            <FileText />
          </p>
          <span className="flex flex-col">
            <p className="text-sm text-gray-500">คำขอทั้งหมด</p>
            {loadStat ? (
              <Loader2
                size={25}
                className="animate-spin mt-1.5 text-blue-500"
              />
            ) : (
              <p className="text-2xl font-bold">
                {Number(stats?.all).toLocaleString() || 0}
              </p>
            )}
          </span>
        </FadeInSection>

        <FadeInSection
          className={
            "p-3.5 bg-white rounded-lg border border-gray-300 shadow-sm flex items-center gap-5"
          }
        >
          <p className="p-2 rounded-lg bg-orange-50 text-orange-500">
            <Clock />
          </p>
          <span className="flex flex-col">
            <p className="text-sm text-gray-500">รอตรวจสอบ</p>
            {loadStat ? (
              <Loader2
                size={25}
                className="animate-spin mt-1.5 text-blue-500"
              />
            ) : (
              <p className="text-2xl font-bold">
                {Number(stats?.pendings).toLocaleString() || 0}
              </p>
            )}
          </span>
        </FadeInSection>
        <FadeInSection
          className={
            "p-3.5 bg-white rounded-lg border border-gray-300 shadow-sm flex items-center gap-5"
          }
        >
          <p className="p-2 rounded-lg bg-green-50 text-green-500">
            <CheckCircle />
          </p>
          <span className="flex flex-col">
            <p className="text-sm text-gray-500">อนุมัติ</p>
            {loadStat ? (
              <Loader2
                size={25}
                className="animate-spin mt-1.5 text-blue-500"
              />
            ) : (
              <p className="text-2xl font-bold">
                {Number(stats?.accepts).toLocaleString() || 0}
              </p>
            )}
          </span>
        </FadeInSection>
        <FadeInSection
          className={
            "p-3.5 bg-white rounded-lg border border-gray-300 shadow-sm flex items-center gap-5"
          }
        >
          <p className="p-2 rounded-lg bg-red-50 text-red-500">
            <X />
          </p>
          <span className="flex flex-col">
            <p className="text-sm text-gray-500">ปฏิเสธ</p>
            {loadStat ? (
              <Loader2
                size={25}
                className="animate-spin mt-1.5 text-blue-500"
              />
            ) : (
              <p className="text-2xl font-bold">
                {Number(stats?.refuses).toLocaleString() || 0}
              </p>
            )}
          </span>
        </FadeInSection>
      </div>
      {/* data */}
      <div className="w-full mt-5 p-5 rounded-lg bg-white shadow-sm">
        <div className="w-full flex items-center justify-between">
          <p className="font-semibold">รายชื่อนักศึกษาและสถานะการลงทะเบียน</p>
        </div>

        <div className="w-full flex flex-wrap items-center gap-1.5 justify-between">
          <div className="mt-2 flex flex-wrap gap-1.5">
            <button
              onClick={() => setRegisStatus("all")}
              className={`p-2 px-3 rounded-lg ${regisStatus === "all" ? "bg-gray-300" : "hover:bg-gray-100"} text-sm`}
            >
              นักศึกษาทั้งหมด ({Number(stats?.stds || 0).toLocaleString() || 0})
            </button>
            <button
              onClick={() => setRegisStatus("no-regis")}
              className={`p-2 px-3 rounded-lg ${regisStatus === "no-regis" ? "bg-gray-300" : "hover:bg-gray-100"} text-sm`}
            >
              ยังไม่ลงทะเบียน (
              {Number(stats?.no_regis || 0).toLocaleString() || 0})
            </button>
            <button
              onClick={() => setRegisStatus("pending")}
              className={`p-2 px-3 rounded-lg ${regisStatus === "pending" ? "bg-gray-300" : "hover:bg-gray-100"} text-sm`}
            >
              รอตรวจสอบ ({Number(stats?.pendings || 0).toLocaleString() || 0})
            </button>
            <button
              onClick={() => setRegisStatus("accept")}
              className={`p-2 px-3 rounded-lg ${regisStatus === "accept" ? "bg-gray-300" : "hover:bg-gray-100"} text-sm`}
            >
              อนุมัติ ({Number(stats?.accepts || 0).toLocaleString() || 0})
            </button>
            <button
              onClick={() => setRegisStatus("refuse")}
              className={`p-2 px-3 rounded-lg ${regisStatus === "refuse" ? "bg-gray-300" : "hover:bg-gray-100"} text-sm`}
            >
              ปฏิเสธ ({Number(stats?.refuses || 0).toLocaleString() || 0})
            </button>
          </div>
          <PaginationBtn
            forwardPage={forwardPage}
            page={page}
            totalPage={totalPage}
            prevPage={prevPage}
          />
        </div>
        <div className="gap-2.5 w-full flex-wrap flex items-center my-2.5">
          <div className="lg:w-1/5 w-full col-span-5 p-2 px-3 rounded-lg border border-gray-300 shadow-sm flex items-center gap-2">
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

          <SelectFaculty
            facultyId={facultyId}
            loadData={loadData}
            setDepartmentId={setDepartmentId}
            setFacultyId={setFacultyId}
            setFaculty={setFaculty}
          />
          <SelectDepartment
            departmentId={departmentId}
            faculty={faculty}
            facultyId={facultyId}
            loadData={loadData}
            setDepartmentId={setDepartmentId}
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

          {/* {filterBtn} */}

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
              className="p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <List size={17} />
              <p className="text-sm">แสดง {take} แถว</p>
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
              className="p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ChevronsUpDown size={17} />
              <p className="text-sm ">เรียง</p>
            </label>
          </div>
          <button
            type="button"
            onClick={resetSearch}
            className="p-2 px-3 rounded-lg text-sm bg-white border border-gray-300 shadow-sm flex items-center gap-2"
          >
            <ListRestart size={17} />
            <p>ล้างการค้นหา</p>
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-5">
          พบข้อมูลทั้งหมด ({total} รายการ)
        </p>
        <div
          className={`mt-3.5 w-full transition-all duration-300 h-[600px] overflow-auto`}
        >
          <table className="w-full hidden lg:table">
            <thead>
              <tr className="border-b border-gray-300 sticky top-0 bg-white shadow-sm">
                <th className="bg-blue-50 text-start px-2.5 py-3 text-sm font-normal text-gray-700">
                  ชื่อ-นามสกุล
                </th>

                <th className="bg-blue-50 text-start px-2.5 py-3 text-sm font-normal text-gray-700">
                  คณะ/สาขาวิชา
                </th>
                <th className="bg-blue-50 text-start px-2.5 py-3 text-sm font-normal text-gray-700">
                  ปีที่เข้าศึกษา
                </th>
                <th className="bg-blue-50 text-start px-2.5 py-3 text-sm font-normal text-gray-700">
                  ปีที่จบการศึกษา
                </th>
                <th className="bg-blue-50 text-start px-2.5 py-3 text-sm font-normal text-gray-700">
                  สถานะ
                </th>
                <th className="bg-blue-50 text-start px-2.5 py-3 text-sm font-normal text-gray-700">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {load ? (
                <RowLoader numCol={6} />
              ) : regisAlumniList.length < 1 ? (
                <RowDataNotFound numCol={6} />
              ) : (
                regisAlumniList.map((r, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                  >
                    <td className="text-sm px-2.5 py-3">
                      <div className="flex flex-col gap-1">
                        <p>
                          {" "}
                          {r?.prefix || ""}
                          {r?.fname || ""} {r?.lname || ""}
                        </p>
                        <p className="text-blue-600"> {r?.alumni_id || ""}</p>
                      </div>
                    </td>

                    <td className="text-sm text-gray-700 px-2.5 py-3">
                      <div className="flex flex-col">
                        <p className="text-black">
                          {facultyText(faculties, r?.facultyId)}
                        </p>
                        <p className="text-gray-700">
                          {departmentText(departments, r?.departmentId)}
                        </p>
                      </div>
                    </td>
                    <td className="text-sm text-gray-700 px-2.5 py-3">
                      {r?.year_start || "ไม่พบข้อมูล"}
                    </td>
                    <td className="text-sm text-gray-700 px-2.5 py-3">
                      {r?.year_end || "ไม่พบข้อมูล"}
                    </td>
                    <td className="text-sm text-gray-700 px-2.5 py-3">
                      {r?.regis_alumni?.isApproved === "pending" ? (
                        <div className="flex flex-col gap-1">
                          <span className="w-fit bg-orange-100 text-orange-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                            รอตรวจสอบ
                          </span>
                        </div>
                      ) : r?.regis_alumni?.isApproved === "accept" ? (
                        <span className="w-fit bg-blue-100 text-blue-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                          ลงทะเบียนแล้ว
                        </span>
                      ) : r?.regis_alumni?.isApproved === "refuse" ? (
                        <div className="flex flex-col gap-1">
                          <span className="w-fit bg-red-100 text-red-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                            การชำระถูกปฏิเสธ
                          </span>
                        </div>
                      ) : (
                        <span className="w-fit bg-gray-100 text-gray-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                          ยังไม่ลงทะเบียน
                        </span>
                      )}
                    </td>
                    <td className="text-sm px-2.5 py-3">
                      <ManageBtn
                        fetch={() => {
                          getRegisAlumniList(
                            facultyId,
                            search,
                            departmentId,
                            selectYearStart,
                            selectYearEnd,
                            take,
                            sort,
                            page,
                            regisStatus,
                          );
                          getStats();
                        }}
                        alumni={r}
                        departments={departments}
                        faculties={faculties}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="grid lg:hidden md:grid-cols-2 gap-2.5">
            {load ? (
              <div className="w-full flex flex-col items-center py-36">
                <Loader2 size={40} className="text-blue-500 animate-spin" />
                <p className="text-sm">กำลังโหลด...</p>
              </div>
            ) : regisAlumniList.length < 1 ? (
              <NoDataFound />
            ) : (
              regisAlumniList.map((r, index) => (
                <div
                  key={index}
                  className="p-5 rounded-lg flex flex-col border border-gray-300 shadow-sm"
                >
                  <div className="w-full flex items-start justify-between">
                    <p className="font-semibold">
                      {r?.prefix || ""}
                      {r?.fname || ""} {r?.lname || ""}
                    </p>
                    {r?.regis_alumni?.isApproved === "pending" ? (
                      <span className="w-fit bg-orange-100 text-orange-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                        รอตรวจสอบ
                      </span>
                    ) : r?.regis_alumni?.isApproved === "pending" ? (
                      <span className="w-fit bg-blue-100 text-blue-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                        ลงทะเบียนแล้ว
                      </span>
                    ) : r?.regis_alumni?.isApproved === "refuse" ? (
                      <span className="w-fit bg-red-100 text-red-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                        การชำระถูกปฏิเสธ
                      </span>
                    ) : (
                      <span className="w-fit bg-gray-100 text-gray-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                        ยังไม่ลงทะเบียน
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-2 pb-3 border-b border-gray-300 text-blue-600">
                    <IdCard size={16} />
                    <p className="text-sm ">663170010324</p>
                  </span>

                  <div className="flex flex-col text-sm p-3 mt-3 rounded-lg bg-blue-50">
                    <span className="text-xs text-gray-600 flex items-center gap-2">
                      <Building size={15} />
                      <p>คณะ/สาขาวิชา</p>
                    </span>
                    <p className="text-black mt-1.5">
                      {facultyText(faculties, r?.facultyId)}
                    </p>
                    <p className="text-gray-700">
                      {departmentText(departments, r?.departmentId)}
                    </p>
                  </div>
                  <div className="mt-1.5s gap-3.5 w-full flex items-center justify-between">
                    <div className="flex flex-1 flex-col text-sm p-3 mt-3 rounded-lg bg-blue-50">
                      <span className="text-xs text-gray-600 flex items-center gap-2">
                        <Calendar size={15} />
                        <p>ปีที่เข้าศึกษา</p>
                      </span>
                      <p className="text-black">
                        {" "}
                        {r?.year_start || "ไม่พบข้อมูล"}
                      </p>
                    </div>
                    <div className="flex flex-1 flex-col text-sm p-3 mt-3 rounded-lg bg-blue-50">
                      <span className="text-xs text-gray-600 flex items-center gap-2">
                        <Calendar size={15} />
                        <p>ปีที่จบ</p>
                      </span>
                      <p className="text-black">
                        {" "}
                        {r?.year_end || "ไม่พบข้อมูล"}
                      </p>
                    </div>
                  </div>
                  <ManageBtn
                    fetch={() => {
                      getRegisAlumniList(
                        facultyId,
                        search,
                        departmentId,
                        selectYearStart,
                        selectYearEnd,
                        take,
                        sort,
                        page,
                        regisStatus,
                      );
                      getStats();
                    }}
                    alumni={r}
                    departments={departments}
                    faculties={faculties}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManageAlumniRegis;
