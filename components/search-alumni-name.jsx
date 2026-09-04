import { useEffect, useMemo, useState } from "react";
import Modal from "./modal";
import {
  Building,
  Calendar,
  ChevronDown,
  ChevronsUpDown,
  File,
  GraduationCap,
  IdCard,
  List,
  ListRestart,
  Loader2,
  Search,
  X,
} from "lucide-react";
import Select from "./select";
import { SelectYearEnd, SelectYearStart } from "./select-year-start";
import { useFacultyDep } from "@/hook/useFacultyDep";
import PaginationBtn from "./pageination-btn";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { debounce } from "lodash";
import RowLoader from "./row-loader";
import RowDataNotFound from "./row-data-notfound";
import { departmentText, facultyText } from "./faculty-p";
import NoDataFound from "./no-data-found";
import EditSlipRegis from "./edit-slip-regis";
import { SelectDepartment, SelectFaculty } from "./select-fac-dep";
import SelectEduLevel from "./select-edu-level";

const SearchAlumniName = () => {
  const { faculties, departments, loadData } = useFacultyDep();
  const [showModal, setShowModal] = useState(false);
  const [regisStatus, setRegisStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [faculty, setFaculty] = useState("");
  const [selectYearStart, setSelectYearStart] = useState("");
  const [selectYearEnd, setSelectYearEnd] = useState("");
  const [take, setTake] = useState(10);
  const [sort, setSort] = useState(JSON.stringify({ year_start: "desc" }));
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [selectEduLevel, setSelectEduLevel] = useState("");
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
    selectEduLevel,
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
            selectEduLevel,
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
    if (!showModal) return;
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
      selectEduLevel,
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
    showModal,
    selectEduLevel,
  ]);
  const [showSearchMenu, setShowSearchMenu] = useState(true);
  const resetSearch = () => {
    setSearch("");
    setFacultyId("");
    setDepartmentId("");
    setFaculty("");
    setSelectYearStart("");
    setSelectYearEnd("");
    setTake(10);
    setSort(JSON.stringify({ year_start: "desc" }));
    setPage(1);
    setSelectEduLevel("");
  };

  return (
    <>
      <button
        onClick={() => {
          setShowModal(true);
        }}
        type="button"
        className="text-sm text-blue-800 hover:underline hover:text-blue-600"
      >
        ตรวจสอบรายชื่อ
      </button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="p-4 z-50 rounded-lg lg:h-auto h-[600px] overflow-auto bg-gray-50 shadow-md w-full lg:w-3/4">
          <div className="w-full flex items-start justify-between">
            <span className="flex flex-col">
              <p className="text-blue-500 font-semibold">
                ค้นหารายชื่อศิษย์เก่า
              </p>
              <p className="text-sm text-gray-700">
                ค้นหารายชื่อ ข้อมูลและสถานะการลงทะเบียนศิษย์เก่า
              </p>
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <X />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4 w-full justify-between">
            <p className="text-sm text-gray-700">เครื่องมือค้นหา</p>
            <button
              type="button"
              className="flex items-center gap-2"
              onClick={() => setShowSearchMenu(!showSearchMenu)}
            >
              <p className="text-sm text-gray-700">
                {showSearchMenu ? "ซ่อน" : "แสดง"}
              </p>
              <ChevronDown
                size={16}
                className={`${showSearchMenu ? "rotate-180" : ""} transition-transform duration-300`}
              />
            </button>
          </div>

          <div
            className={`
    flex-wrap items-center gap-2.5 w-full p-1.5 lg:p-5 rounded-lg shadow-xs bg-white my-2.5
    transition-all duration-300 ease-in-out
    ${showSearchMenu ? " flex max-h-auto opacity-100" : "max-h-0 opacity-0 hidden"}
  `}
          >
            <div className="bg-white lg:w-1/3 w-full col-span-5 p-2 px-3 rounded-lg border border-gray-300 shadow-sm flex items-center gap-2">
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
              loadData={loadData}
              setDepartmentId={setDepartmentId}
              setFacultyId={setFacultyId}
              setFaculty={setFaculty}
              facultyId={facultyId}
              faculties={faculties}
              width="w-full lg:w-1/4"
            />

            <SelectDepartment
              loadData={loadData}
              faculty={faculty}
              facultyId={facultyId}
              setDepartmentId={setDepartmentId}
              departmentId={departmentId}
              departments={departments}
              width="w-full lg:w-1/4"
            />
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
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer bg-white"
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
                className="bg-white p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer bg-white"
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
                className="bg-white p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ChevronsUpDown size={17} />
                <p className="text-sm">เรียง</p>
              </label>
            </div>
            <div title="สถานะการลงทะเบียน" className="relative inline-block">
              <select
                onChange={(e) => {
                  setRegisStatus(e.target.value);
                  setPage(1);
                }}
                value={regisStatus}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer bg-white"
              >
                <option value={"all"} className="text-sm">
                  ทั้งหมด
                </option>
                <option value={"no-regis"} className="text-sm">
                  ยังไม่ลงทะเบียน
                </option>
                <option value={"pending"} className="text-sm">
                  รอตรวจสอบ
                </option>
                <option value={"accept"} className="text-sm">
                  อนุมัติแล้ว
                </option>
                <option value={"refuse"} className="text-sm">
                  ปฏิเสธ
                </option>
              </select>
              <label
                htmlFor="select-row"
                className="bg-white p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <File size={17} />
                <p className="text-sm">
                  {regisStatus === "all"
                    ? "ทุกสถานะ"
                    : regisStatus === "no-regis"
                      ? "ยังไม่ลงทะเบียน"
                      : regisStatus === "pending"
                        ? "รอตรวจสอบ"
                        : regisStatus === "accept"
                          ? "อนุมัติแล้ว"
                          : "ปฏิเสธ"}
                </p>
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

          <div className="flex flex-col gap-2 mt-5 w-full p-2.5 lg:p-5 rounded-lg bg-white shadow-xs">
            <div className="w-full flex flex-col md:flex-row md:items-center justify-between">
              <span className="flex items-center gap-2">
                <GraduationCap className="text-blue-500" />
                <p className="text-sm font-semibold">
                  รายชื่อศิษย์เก่าทั้งหมด ({total} คน)
                </p>
              </span>
              <PaginationBtn
                forwardPage={forwardPage}
                page={page}
                totalPage={totalPage}
                prevPage={prevPage}
              />
            </div>

            <div
              className={`mt-3.5 w-full transition-all duration-300 ${showSearchMenu ? "lg:h-[300px]" : "lg:h-[450px]"} overflow-auto`}
            >
              <table className="w-full hidden lg:table">
                <thead>
                  <tr className="border-b border-gray-300 sticky top-0 bg-white shadow-sm">
                    <th className="text-start px-2.5 pb-3 text-sm font-normal text-gray-700">
                      ชื่อ-นามสกุล
                    </th>

                    <th className="text-start px-2.5 pb-3 text-sm font-normal text-gray-700">
                      คณะ/สาขาวิชา
                    </th>
                    <th className="text-start px-2.5 pb-3 text-sm font-normal text-gray-700">
                      ปีที่เข้าศึกษา
                    </th>
                    <th className="text-start px-2.5 pb-3 text-sm font-normal text-gray-700">
                      ปีที่จบการศึกษา
                    </th>
                    <th className="text-start px-2.5 pb-3 text-sm font-normal text-gray-700">
                      สถานะ
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
                            <p className="text-blue-600">
                              {" "}
                              {r?.alumni_id || ""}
                            </p>
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
                              <EditSlipRegis alumni={r} />
                            </div>
                          ) : r?.regis_alumni?.isApproved === "accept" ? (
                            <span className="w-fit bg-blue-100 text-blue-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                              ลงทะเบียนแล้ว
                            </span>
                          ) : r?.regis_alumni?.isApproved === "refuse" ? (
                            <div className="flex flex-col gap-1">
                              <span className="w-fit bg-red-100 text-red-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                                การชำระปฏิเสธ
                              </span>
                              <EditSlipRegis alumni={r} />
                            </div>
                          ) : (
                            <span className="w-fit bg-gray-100 text-gray-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                              ยังไม่ลงทะเบียน
                            </span>
                          )}
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
                        ) : r?.regis_alumni?.isApproved === "accept" ? (
                          <span className="w-fit bg-blue-100 text-blue-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                            ลงทะเบียนแล้ว
                          </span>
                        ) : r?.regis_alumni?.isApproved === "refuse" ? (
                          <span className="w-fit bg-red-100 text-red-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                            การชำระปฏิเสธ
                          </span>
                        ) : (
                          <span className="w-fit bg-gray-100 text-gray-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                            ยังไม่ลงทะเบียน
                          </span>
                        )}
                      </div>

                      <span className="flex items-center gap-2 pb-3 border-b border-gray-300 text-blue-600">
                        <IdCard size={16} />
                        <p className="text-sm ">{r?.alumni_id}</p>
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
                      {(r?.regis_alumni?.isApproved === "pending" ||
                        r?.regis_alumni?.isApproved === "refuse") && (
                        <EditSlipRegis alumni={r} />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default SearchAlumniName;
