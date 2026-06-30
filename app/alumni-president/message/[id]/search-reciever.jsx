import { departmentText, facultyText } from "@/components/faculty-p";
import PaginationBtn from "@/components/pageination-btn";
import SearchBox from "@/components/search-box";
import { SelectDepartment, SelectFaculty } from "@/components/select-fac-dep";
import { SelectYearEnd, SelectYearStart } from "@/components/select-year-start";
import { apiConfig } from "@/config/api.config";
import { useFacultyDep } from "@/hook/useFacultyDep";
import useGetSession from "@/hook/useGetSeesion";
import { alerts } from "@/libs/alerts";
import { forwardPage, prevPage } from "@/libs/pagination-helper";
import axios from "axios";
import { debounce } from "lodash";
import { Calendar, FolderOpen, Loader2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ViewSelectAlumni from "./view-select-alumni";

const SearchReciever = ({ selectAlumniId, setSelectAlumniId }) => {
  const { departments, faculties, loadData } = useFacultyDep();
  const { user } = useGetSession();

  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState();
  const [total, setTotal] = useState(0);
  // ✅ ควบคุม pagination/filter state ที่นี่ (parent)
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [facultyId, setFacultyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const [selectYearStart, setSelectYearStart] = useState("");
  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState();

  const resetData = () => {
    setFacultyId(user?.roleId <= 3 ? `${user?.facultyId}` : "");
    setDepartmentId(user?.roleId < 3 ? `${user?.departmentId}` : "");
    setSearch("");
    setPage(1);
    setSelectYearStart("");
  };

  const fetchData = async (
    page = 1,
    search = "",
    facultyId = "",
    departmentId = "",
    selectYearStart,
    current = {},
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/president/alumni-list", {
        withCredentials: true,
        params: {
          page,
          take: 25,
          search,
          facultyId: String(facultyId),
          departmentId: String(departmentId),
          sort: JSON.stringify({ createtAt: "desc" }),
          selectYearStart,
          current,
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

  const debounceSearch = useMemo(() => debounce(fetchData, 600), [fetchData]);
  useEffect(() => {
    debounceSearch(page, search, facultyId, departmentId, selectYearStart);
  }, [page, search, facultyId, departmentId, selectYearStart]);

  const handleSelectAlumniId = (alumni) => {
    setSelectAlumniId((prev) =>
      prev.includes(alumni)
        ? prev.filter((p) => p !== alumni)
        : [...prev, alumni],
    );
  };

  return (
    <div className="w-full flex flex-col mt-1 gap-0 shadow-xs">
      <div className="gap-2.5 w-full flex-wrap p-3.5 text-gray-700 rounded-tr-lg rounded-tl-lg bg-linear-90 from-blue-50  border border-gray-200 border-b-0 flex items-center mt-2.5">
        <div className="w-full lg:w-1/3">
          <SearchBox
            page={page}
            search={search}
            setPage={setPage}
            setSearch={setSearch}
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

        <button
          title="ล้างการค้นหา"
          onClick={resetData}
          className="p-2 bg-white px-3.5 justify-center rounded-lg border border-gray-300 shadow-md flex items-center gap-2"
        >
          <Trash2 size={17} />
          {/* <p className="text-sm ">ล้าง</p> */}
        </button>
      </div>
      <div className="w-full border border-gray-200 flex flex-col h-[300px] overflow-auto">
        {loading ? (
          <div className="w-full flex flex-col py-24 items-center gap-1.5 text-sm">
            <Loader2 size={35} className="animate-spin text-blue-500" />
            <p>กำลังโหลด...</p>
          </div>
        ) : data.length < 1 ? (
          <div className="w-full text-gray-600 flex flex-col py-24 items-center gap-1.5 text-sm">
            <FolderOpen size={35} className="" />
            <p>ไม่พบข้อมูล</p>
          </div>
        ) : (
          data.map((d, index) => (
            <div
              key={index}
              onClick={() => handleSelectAlumniId(d?.alumni_id)}
              className=" w-full p-3.5 border-b border-gray-300 text-sm cursor-pointer hover:bg-blue-50 flex items-center gap-2.5"
            >
              <input
                readOnly
                checked={selectAlumniId.includes(d?.alumni_id)}
                type="checkbox"
                className="w-4 h-4"
              />
              <div className="flex flex-col">
                <p>
                  {d?.prefix || ""}
                  {d?.fname} {d?.lname} ({d?.alumni_id})
                </p>
                <p className="text-xs text-gray-700">
                  {facultyText(faculties, d?.facultyId)}-
                  {departmentText(departments, d?.departmentId)}
                </p>
                <span className="flex items-center gap-1 text-xs mt-1">
                  <Calendar size={15} className="text-blue-400" />
                  <p className="text-gray-700">
                    ปีการศึกษา {d?.year_start} - {d?.year_end}
                  </p>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="w-full p-3.5 border border-gray-200 rounded-bl-lg rounded-br-lg flex items-center justify-between">
        <p className="text-xs text-gray-700">พบ {total} รายชื่อ</p>
        <PaginationBtn
          forwardPage={() => forwardPage(page, setPage, totalPage)}
          page={page}
          prevPage={() => prevPage(page, setPage)}
          totalPage={totalPage}
        />
      </div>
    </div>
  );
};
export default SearchReciever;
