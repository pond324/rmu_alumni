"use client";
import { departmentText, facultyText } from "@/components/faculty-p";

import { apiConfig } from "@/config/api.config";
import useGetSession from "@/hook/useGetSeesion";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { Eye, Filter } from "lucide-react";
import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import ToggleAccoutStatus from "@/components/toggle-account-status";
import { useFacultyDep } from "@/hook/useFacultyDep";
import RowLoader from "@/components/row-loader";
import RowDataNotFound from "@/components/row-data-notfound";
import DropdownMenu from "@/components/dropdown";
import AlumniData from "./alumni-data";
import DeleteAlumniData from "./delete-alumni-data";

const { default: TablePage } = require("@/components/table-page");
const Page = () => {
  const { departments, faculties } = useFacultyDep();
  const { user } = useGetSession();

  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState();
  const [total, setTotal] = useState(0);
  // ✅ ควบคุม pagination/filter state ที่นี่ (parent)
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(25);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(JSON.stringify({ year_start: "desc" }));
  const [facultyId, setFacultyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [filterWork, setFilterWork] = useState({});
  const [selectYearStart, setSelectYearStart] = useState("");
  const [selectYearEnd, setSelectYearEnd] = useState("");
  const [selectEduLevel, setSelectEduLevel] = useState("");

  useEffect(() => {
    setFacultyId(user?.roleId <= 3 ? `${user?.facultyId}` : "");
    setDepartmentId(user?.roleId < 3 ? `${user?.departmentId}` : "");
  }, [user]);

  const [loading, setLoading] = useState(true);

  const fetchData = async (
    page = 1,
    take = 25,
    search = "",
    facultyId = "",
    departmentId = "",
    sort,
    selectYearStart,
    selectYearEnd,
    current = {},
    selectEduLevel,
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/president/alumni-list", {
        withCredentials: true,
        params: {
          page,
          take,
          search,
          facultyId: String(facultyId),
          departmentId: String(departmentId),
          sort,
          selectYearStart,
          selectYearEnd,
          current,
          selectEduLevel,
        },
      });
      if (res.status === 200) {
        setData(res.data.result);
        setTotalPage(res.data.totalPage);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  const filterByWork = (e) => {
    const { value } = e.target;
    setFilterWork(value); // ✅ เก็บค่า filterWork
    setPage(1); // reset page
  };

  return (
    <>
      <TablePage
        header="รายชื่อศิษย์เก่า"
        theads={["วันที่นำเข้าข้อมูล", "ลงทะเบียน", "บัญชี", "จัดการ"]}
        fetchData={fetchData}
        totalPage={totalPage}
        total={total}
        exportData={data.map((d) => ({
          รหัสนักศึกษา: d?.alumni_id,
          คำนำหน้า: d?.prefix,
          ชื่อ: d?.fname,
          นามสกุล: d?.lname,
          คณะ: facultyText(faculties, d?.facultyId),
          สาขาวิชา: departmentText(departments, d?.departmentId),
          "ปีที่เข้ารับการศึกษา(พ.ศ.)": 25 + `${d?.alumni_id}`.substring(0, 2),
          "ปีการศึกษา(พ.ศ.)": `${d?.year_start} - ${d?.year_end}`,
        }))}
        filterBtn={
          <div title="กรอง" className="relative inline-block">
            <select
              onChange={filterByWork}
              name=""
              id="select-row"
              className="absolute inset-0 w-full h-full bg-white opacity-0 cursor-pointer"
            >
              <option value="" className="text-sm">
                ทั้งหมด
              </option>
              <option
                value={JSON.stringify({
                  work_expreriences: {
                    none: {},
                  },
                })}
                className="text-sm"
              >
                ไม่พบประวัติ
              </option>
              <option
                value={JSON.stringify({
                  work_expreriences: {
                    some: {},
                  },
                })}
                className="text-sm"
              >
                ศิษย์เก่าที่กรอกประวัติแล้ว
              </option>
            </select>

            <label
              htmlFor="select-row"
              className="p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Filter size={17} />
              <p className="text-sm">กรอง</p>
            </label>
          </div>
        }
        // ✅ ควบคุม state จาก parent
        page={page}
        setPage={setPage}
        take={take}
        setTake={setTake}
        sort={sort}
        setSort={setSort}
        search={search}
        setSearch={setSearch}
        facultyId={facultyId}
        setFacultyId={setFacultyId}
        departmentId={departmentId}
        setDepartmentId={setDepartmentId}
        extraFilter={filterWork}
        setExtraFilter={setFilterWork}
        selectYearEnd={selectYearEnd}
        selectYearStart={selectYearStart}
        setSelectYearEnd={setSelectYearEnd}
        setSelectYearStart={setSelectYearStart}
        selectEduLevel={selectEduLevel}
        setSelectEduLevel={setSelectEduLevel} // ✅ optional filter
      >
        {loading ? (
          <RowLoader numcol={7} />
        ) : data.length > 0 ? (
          data.map((d, index) => (
            <tr
              key={uuid()}
              className="border-b border-gray-200 cursor-pointer hover:bg-gray-50 text-sm"
            >
              <td className="p-2  text-start">
                <div className="flex flex-col gap-0.5">
                  <p>
                    {" "}
                    {d?.prefix}
                    {d?.fname} {d?.lname}
                  </p>
                  <p className="text-sm text-blue-400"> {d?.alumni_id}</p>
                </div>
              </td>
              <td className="p-2  text-start">
                <div className="flex flex-col">
                  <p>
                    {" "}
                    {d?.facultyId
                      ? facultyText(faculties, d?.facultyId) ||
                        "ไม่พบรหัสคณะนี้"
                      : "ไม่พบข้อมูล"}
                  </p>
                  <p className="text-gray-600">
                    {" "}
                    {d?.departmentId
                      ? departmentText(departments, d?.departmentId) ||
                        "ไม่พบสาขาวิชานี้"
                      : "ไม่พบข้อมูล"}
                  </p>
                </div>
              </td>
              <td className="p-2  text-start text-sm">
                {d?.year_start || "ไม่พบข้อมูล"} -{" "}
                {d?.year_end || "ไม่พบข้อมูล"}
              </td>
              <td className="p-2  text-start text-sm">
                <p className="p-1.5 w-fit px-2 rounded-full bg-blue-50 shadow-xs text-xs">
                  {" "}
                  {new Date(d?.createtAt).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })}
                </p>
              </td>

              <td className="p-2">
                {d?.regis_alumni?.isApproved === "pending" ? (
                  <span className="w-fit bg-orange-100 text-orange-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                    รอตรวจสอบ
                  </span>
                ) : d?.regis_alumni?.isApproved === "pending" ? (
                  <span className="w-fit bg-blue-100 text-blue-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                    ลงทะเบียนแล้ว
                  </span>
                ) : d?.regis_alumni?.isApproved === "refuse" ? (
                  <span className="w-fit bg-red-100 text-red-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                    การชำระถูกปฏิเสธ
                  </span>
                ) : (
                  <span className="w-fit bg-gray-100 text-gray-800 px-2 py-1.5 rounded-full text-xs font-semibold">
                    ยังไม่ลงทะเบียน
                  </span>
                )}
              </td>
              <td className="p-2">
                <ToggleAccoutStatus
                  fetchData={fetchData}
                  user_id={d?.alumni_id}
                  canUse={d?.canUse}
                  role={1}
                />
              </td>
              <td className="p-2 ">
                <DropdownMenu>
                  <>
                    <AlumniData alumniId={d?.alumni_id} />
                    <DeleteAlumniData
                      alumni_id={d?.alumni_id}
                      fetch={() =>
                        fetchData(
                          page,
                          take,
                          search,
                          facultyId,
                          departmentId,
                          sort,
                          selectYearStart,
                          selectYearEnd,
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
      </TablePage>
    </>
  );
};
export default Page;
