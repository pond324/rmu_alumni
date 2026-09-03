"use client";
import React, { useEffect, useState, useMemo } from "react";
import PieChartComponent from "@/components/chart-pie";
import ChartSimple from "@/components/chart-simple";
import Select from "react-select";
import {
  Users,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Building2,
  TrendingUp,
  Sparkles,
  MapPin,
  Calendar,
  X,
  RefreshCw,
  Layers,
  DollarSign,
  Filter,
  ArrowUpRight,
  Check,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  MapPinHouse,
  ChevronRight,
  UserX,
  Coins,
} from "lucide-react";
import useGetSession from "@/hook/useGetSeesion";
import { departmentText, facultyText } from "@/components/faculty-p";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import Loading from "@/components/loading";
import Image from "next/image";
import { NO_PROFILE_IMG } from "../profile/alumni-profile";
import { useDashboardContext } from "./dashboard-context";
import NoData from "@/components/nodata";
import { useAppContext } from "@/context/app.context";
import { useRouter } from "next/navigation";
import {
  FaCoins,
  FaEllipsisH,
  FaFolderOpen,
  FaGlobe,
  FaGraduationCap,
  FaMapMarked,
  FaPlaneDeparture,
} from "react-icons/fa";
import WorkPlaceRatePieChartComponent from "./work-place-rate";
import { SelectYearEnd, SelectYearStart } from "@/components/select-year-start";
import FadeInSection from "@/components/fade-in-section";
import LineChartComponent from "@/components/line-chart";
import AlumniColumnChart from "@/components/column-chart";
import { useFacultyDep } from "@/hook/useFacultyDep";
import ExportBtn from "./export-btn";

const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse flex flex-col justify-between h-[128px]">
    <div className="flex justify-between items-start">
      <div className="h-4 bg-slate-200 rounded w-24"></div>
      <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
    </div>
    <div className="h-7 bg-slate-200 rounded w-32"></div>
    <div className="h-3 bg-slate-100 rounded w-20"></div>
  </div>
);

const ChartSkeleton = ({ height = 350 }) => (
  <div
    style={{ height }}
    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse flex flex-col gap-4"
  >
    <div className="flex justify-between items-center">
      <div className="h-5 bg-slate-200 rounded w-48"></div>
      <div className="h-4 bg-slate-100 rounded w-24"></div>
    </div>
    <div className="flex-1 bg-slate-100 rounded-xl"></div>
  </div>
);

const Dashboard = () => {
  const { faculties, departments, loadData } = useFacultyDep();
  const { user } = useGetSession();
  const {
    setFaculty,
    setDepartment,
    selectYearStart,
    selectYearEnd,
    setSelectYearStart,
    setSelectYearEnd,
  } = useDashboardContext();
  const { setPrevPath } = useAppContext();
  const router = useRouter();

  // Selected filters (null or { id, name })
  const [selectFaculty, setSelectFacultyState] = useState(null);
  const [selectDepartment, setSelectDepartmentState] = useState(null);

  // Loading states
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);

  // Data states
  const [headerData, setHeaderData] = useState(null);
  const [chartbarData, setChartbarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [pieWorkRate, setPieWorkRate] = useState([]);
  const [otherCountryList, setOtherCountryList] = useState([]);
  const [populationJob, setPopulationJob] = useState([]);
  const [mostLiverPercent, setMostLivePercent] = useState({ result: [] });
  const [workRatePercent, setWorkRatePercent] = useState([]);
  const [noWorkData, setNoWorkData] = useState([]);
  const [alumniNoWorkList, setAlumniNoWorkList] = useState([]);

  // Helper to resolve faculty name by ID
  const getFacultyName = (id) => {
    if (!id) return "ไม่ระบุคณะ";
    const found = (faculties || []).find(
      (f) =>
        String(f?.value) === String(id) ||
        String(f?.id) === String(id) ||
        String(f?.faculty_id) === String(id)
    );
    return found?.label || found?.name || found?.faculty_name || `คณะ (${id})`;
  };

  // Helper to resolve department name by ID
  const getDepartmentName = (id) => {
    if (!id) return "ไม่ระบุสาขา";
    const found = (departments || []).find(
      (d) =>
        String(d?.value) === String(id) ||
        String(d?.id) === String(id) ||
        String(d?.department_id) === String(id)
    );
    return found?.label || found?.name || found?.department_name || `สาขา (${id})`;
  };

  // Faculty dropdown menu items
  const selectFacultyMenus = useMemo(() => {
    return (faculties || []).map((f) => {
      const id = f.value ?? f.id ?? f.faculty_id;
      const title = f.label ?? f.name ?? f.faculty_name;
      return {
        id,
        title,
        func: () => {
          const facObj = { id, name: title, value: id, label: title };
          setSelectFacultyState(facObj);
          setFaculty(facObj);
          setSelectDepartmentState(null);
          setDepartment(null);
        },
      };
    });
  }, [faculties, setFaculty, setDepartment]);

  // Department dropdown menu items
  const selectDepartmentMenus = useMemo(() => {
    let list = departments || [];
    const targetFacId =
      selectFaculty?.id ||
      selectFaculty?.value ||
      (user?.roleId <= 3 ? user?.facultyId : null);

    if (targetFacId) {
      const facSub =
        String(targetFacId).length >= 2
          ? String(targetFacId).substring(1, 2)
          : String(targetFacId);

      list = list.filter((d) => {
        const depIdStr = String(d.value ?? d.id ?? d.department_id);
        const depFacId = d.faculty_id ? String(d.faculty_id) : null;
        return (
          (depFacId && depFacId === String(targetFacId)) ||
          depIdStr.substring(0, 1) === facSub ||
          depIdStr.startsWith(String(targetFacId))
        );
      });
    }

    return list.map((d) => {
      const id = d.value ?? d.id ?? d.department_id;
      const title = d.label ?? d.name ?? d.department_name;
      return {
        id,
        title,
        func: () => {
          const deptObj = { id, name: title, value: id, label: title };
          setSelectDepartmentState(deptObj);
          setDepartment(deptObj);
        },
      };
    });
  }, [departments, user, selectFaculty, setDepartment]);

  // Clear all filters
  const clearQuery = () => {
    setSelectYearStart("");
    setSelectYearEnd("");
    setSelectFacultyState(null);
    setSelectDepartmentState(null);
    setFaculty(null);
    setDepartment(null);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectFaculty) count++;
    if (selectDepartment) count++;
    if (selectYearStart) count++;
    if (selectYearEnd) count++;
    return count;
  }, [selectFaculty, selectDepartment, selectYearStart, selectYearEnd]);

  // Fetch KPI stats
  const fetchPageStart = async (facId = "", deptId = "", yrStart = "", yrEnd = "") => {
    setLoadingOverview(true);
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/dashboard/all-avg", {
        withCredentials: true,
        params: {
          facultyId: facId || undefined,
          departmentId: deptId || undefined,
          selectYearStart: yrStart || undefined,
          selectYearEnd: yrEnd || undefined,
        },
      });
      if (res.status === 200) {
        setHeaderData(res.data);
      }
    } catch (error) {
      console.error("fetchPageStart error:", error);
      alerts.err("ไม่สามารถโหลดข้อมูลสถิติภาพรวมได้");
    } finally {
      setLoadingOverview(false);
    }
  };

  // Fetch bar chart data (Employed vs Unemployed)
  const fetchChartBarData = async (facId = "", yrStart = "", yrEnd = "") => {
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/dashboard/chart-bar-data", {
        withCredentials: true,
        params: {
          facultyId: facId || undefined,
          selectYearStart: yrStart || undefined,
          selectYearEnd: yrEnd || undefined,
        },
      });
      if (res.status === 200) {
        const data = res.data || [];
        const isDeptLevel = (user?.roleId && user.roleId < 3) || Boolean(selectFaculty);
        const result = data.map((d) => {
          const name = isDeptLevel ? getDepartmentName(d.id) : getFacultyName(d.id);
          return {
            name,
            working: Number(d.working) || 0,
            unemployed: Number(d.unemployed) || 0,
          };
        });
        setChartbarData(result);
      }
    } catch (error) {
      console.error("fetchChartBarData error:", error);
    }
  };

  // Fetch average salary per faculty/dept
  const fetchPieData = async (facId = "", yrStart = "", yrEnd = "") => {
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/dashboard/pie-chart-data", {
        withCredentials: true,
        params: {
          facultyId: facId || undefined,
          selectYearStart: yrStart || undefined,
          selectYearEnd: yrEnd || undefined,
        },
      });
      if (res.status === 200) {
        const data = res.data || [];
        const isDeptLevel = (user?.roleId && user.roleId < 4) || Boolean(selectFaculty);
        const result = data.map((d) => {
          const name =
            isDeptLevel && d.departmentId
              ? getDepartmentName(d.departmentId)
              : getFacultyName(d.facultyId);
          return {
            name,
            value: Math.round(Number(d.avgSalary) || 0),
          };
        });
        setPieData(result);
      }
    } catch (error) {
      console.error("fetchPieData error:", error);
    }
  };

  // Fetch Work Place Rate (In Thailand vs Abroad)
  const fetchWorkPlaceRate = async (facId = "", deptId = "", yrStart = "", yrEnd = "") => {
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/dashboard/work-place-rate", {
        withCredentials: true,
        params: {
          facultyId: facId || undefined,
          departmentId: deptId || undefined,
          selectYearStart: yrStart || undefined,
          selectYearEnd: yrEnd || undefined,
        },
      });
      if (res.status === 200) {
        setPieWorkRate(res.data?.result || []);
        setOtherCountryList(res.data?.countryList || []);
      }
    } catch (error) {
      console.error("fetchWorkPlaceRate error:", error);
    }
  };

  // Fetch Most Popular Jobs
  const fetchMostPopular = async (facId = "", deptId = "", yrStart = "", yrEnd = "") => {
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/dashboard/population-job", {
        withCredentials: true,
        params: {
          facultyId: facId || undefined,
          departmentId: deptId || undefined,
          selectYearStart: yrStart || undefined,
          selectYearEnd: yrEnd || undefined,
        },
      });
      if (res.status === 200) {
        const data = res.data || [];
        const result = data.map((d) => ({
          name: d?.job_position || "ไม่ระบุตำแหน่ง",
          count: Number(d?._count?.alumniId) || 0,
        }));
        setPopulationJob(result);
      }
    } catch (error) {
      console.error("fetchMostPopular error:", error);
    }
  };

  // Fetch Top Provinces
  const fetchMostLive = async (facId = "", deptId = "", yrStart = "", yrEnd = "") => {
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/dashboard/most-live-province", {
        withCredentials: true,
        params: {
          facultyId: facId || undefined,
          departmentId: deptId || undefined,
          selectYearStart: yrStart || undefined,
          selectYearEnd: yrEnd || undefined,
        },
      });
      if (res.status === 200) {
        setMostLivePercent(res.data || { result: [] });
      }
    } catch (error) {
      console.error("fetchMostLive error:", error);
    }
  };

  // Fetch Work Rate Percent
  const fetchWorkRatePercent = async (facId = "", yrStart = "", yrEnd = "") => {
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/dashboard/workrate-percent", {
        withCredentials: true,
        params: {
          facultyId: facId || undefined,
          selectYearStart: yrStart || undefined,
          selectYearEnd: yrEnd || undefined,
        },
      });
      if (res.status === 200) {
        const data = res.data || [];
        const isDeptLevel = (user?.roleId && user.roleId < 3) || Boolean(selectFaculty);
        const result = data.map((d) => {
          const name = isDeptLevel ? getDepartmentName(d.id) : getFacultyName(d.id);
          return {
            name,
            percent: Math.round(Number(d?.percent) || 0),
          };
        });
        setWorkRatePercent(result);
      }
    } catch (error) {
      console.error("fetchWorkRatePercent error:", error);
    }
  };

  // Fetch No Work Data
  const fetchNoWorkData = async (facId = "", deptId = "", yrStart = "", yrEnd = "") => {
    try {
      const res = await axios.get(apiConfig.rmuAPI + "/dashboard/no-work-data", {
        withCredentials: true,
        params: {
          facultyId: facId || undefined,
          departmentId: deptId || undefined,
          selectYearStart: yrStart || undefined,
          selectYearEnd: yrEnd || undefined,
        },
      });
      if (res.status === 200) {
        setNoWorkData(res.data?.result || []);
        if ((user?.roleId && user.roleId < 3) || selectDepartment) {
          setAlumniNoWorkList(res.data?.alumniNoWork || []);
        }
      }
    } catch (error) {
      console.error("fetchNoWorkData error:", error);
    }
  };

  // Trigger all fetches
  useEffect(() => {
    if (!user || loadData) return;
    setLoadingCharts(true);

    const facId = selectFaculty?.id || "";
    const deptId = selectDepartment?.id || "";

    Promise.all([
      fetchPageStart(facId, deptId, selectYearStart, selectYearEnd),
      fetchChartBarData(facId, selectYearStart, selectYearEnd),
      fetchPieData(facId, selectYearStart, selectYearEnd),
      fetchMostPopular(facId, deptId, selectYearStart, selectYearEnd),
      fetchMostLive(facId, deptId, selectYearStart, selectYearEnd),
      fetchWorkRatePercent(facId, selectYearStart, selectYearEnd),
      fetchNoWorkData(facId, deptId, selectYearStart, selectYearEnd),
      fetchWorkPlaceRate(facId, deptId, selectYearStart, selectYearEnd),
    ]).finally(() => {
      setLoadingCharts(false);
    });
  }, [
    user,
    selectDepartment,
    selectFaculty,
    selectYearStart,
    selectYearEnd,
    faculties,
    departments,
    loadData,
  ]);

  if (!user) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loading type={2} />
        <p className="text-sm font-medium">กำลังเตรียมข้อมูลระบบ...</p>
      </div>
    );
  }

  // Scope label for current view
  const scopeLabel = () => {
    let parts = [];
    if (selectFaculty) parts.push(selectFaculty.name || selectFaculty.label);
    if (selectDepartment) parts.push(`สาขาวิชา${selectDepartment.name || selectDepartment.label}`);
    if (parts.length === 0) {
      if (user?.roleId < 3) parts.push(getDepartmentName(user?.departmentId));
      else if (user?.roleId === 3) parts.push(getFacultyName(user?.facultyId));
      else parts.push("มหาวิทยาลัยราชภัฏมหาสารคาม (ทุกคณะ)");
    }
    return parts.join(" • ");
  };

  const employmentPercentage =
    headerData?.allAlumni && headerData.allAlumni > 0
      ? ((Number(headerData?.alumniWorking || 0) / Number(headerData.allAlumni)) * 100).toFixed(1)
      : 0;

  return (
    <div className="w-full flex-1 flex flex-col bg-slate-100 pb-16 font-sans">
      {/* ================= TOP HEADER BAR ================= */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs px-4 sm:px-8 py-3 transition-all flex flex-col gap-2.5">
        {/* Main Row: Title & Action Buttons (Matches Image 2) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Title */}
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-800 tracking-tight">
              ภาพรวมสรุปข้อมูลของศิษย์เก่า ภายใน
              {selectFaculty
                ? selectFaculty.name
                : "มหาวิทยาลัยราชภัฏมหาสารคาม"}
            </h1>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Year Start Picker */}
            <SelectYearStart
              selectYearStart={selectYearStart}
              setSelectYearStart={setSelectYearStart}
              setPage={() => {}}
            />

            {/* Year End Picker */}
            <SelectYearEnd
              selectYearEnd={selectYearEnd}
              setSelectYearEnd={setSelectYearEnd}
              setPage={() => {}}
            />

            {/* Export PDF / Report Button */}
            <ExportBtn
              selecetFacultyId={
                selectFaculty?.id ||
                (user?.roleId <= 3 ? user?.facultyId : "")
              }
              selectDepartmentId={
                selectDepartment?.id ||
                (user?.roleId < 3 ? user?.departmentId : "")
              }
              selectYearStart={selectYearStart}
              selectYearEnd={selectYearEnd}
            />
          </div>
        </div>

        {/* Secondary Filter Row (Faculty & Department for Admins/Executives) */}
        {user?.roleId > 2 && (
          <div className="flex items-center gap-2 flex-wrap pt-2.5 border-t border-gray-100">
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <Filter size={13} /> ตัวกรอง:
            </span>

            {/* Faculty React-Select */}
            {user?.roleId > 3 && (
              <div className="w-[200px] sm:w-[220px]">
                <Select
                  instanceId="select-faculty"
                  placeholder="เลือกคณะ..."
                  isClearable
                  isSearchable
                  options={faculties.map((f) => ({
                    value: f.value ?? f.id,
                    label: f.label ?? f.name,
                  }))}
                  value={
                    selectFaculty
                      ? { value: selectFaculty.id, label: selectFaculty.name }
                      : null
                  }
                  onChange={(opt) => {
                    if (!opt) {
                      setSelectFacultyState(null);
                      setFaculty(null);
                      setSelectDepartmentState(null);
                      setDepartment(null);
                    } else {
                      const facObj = {
                        id: opt.value,
                        name: opt.label,
                        value: opt.value,
                        label: opt.label,
                      };
                      setSelectFacultyState(facObj);
                      setFaculty(facObj);
                      setSelectDepartmentState(null);
                      setDepartment(null);
                    }
                  }}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderRadius: "0.5rem",
                      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                      boxShadow: state.isFocused
                        ? "0 0 0 1px #3b82f6"
                        : "0 1px 2px 0 rgba(0,0,0,0.05)",
                      backgroundColor: "#ffffff",
                      minHeight: "36px",
                      height: "36px",
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                      "&:hover": { borderColor: "#9ca3af" },
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#6b7280",
                      fontSize: "0.8125rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "#1f2937",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: "36px",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 50,
                      borderRadius: "0.5rem",
                    }),
                  }}
                />
              </div>
            )}

            {/* Department React-Select */}
            <div className="w-[200px] sm:w-[240px]">
              <Select
                instanceId="select-department"
                placeholder="เลือกสาขาวิชา..."
                isClearable
                isSearchable
                isDisabled={user?.roleId > 3 && !selectFaculty}
                options={(() => {
                  let list = departments || [];
                  const targetFacId =
                    selectFaculty?.id ||
                    selectFaculty?.value ||
                    (user?.roleId <= 3 ? user?.facultyId : null);
                  if (targetFacId) {
                    const facSub =
                      String(targetFacId).length >= 2
                        ? String(targetFacId).substring(1, 2)
                        : String(targetFacId);
                    list = list.filter((d) => {
                      const depIdStr = String(d.value ?? d.id);
                      const depFacId = d.faculty_id
                        ? String(d.faculty_id)
                        : null;
                      return (
                        (depFacId && depFacId === String(targetFacId)) ||
                        depIdStr.substring(0, 1) === facSub ||
                        depIdStr.startsWith(String(targetFacId))
                      );
                    });
                  }
                  return list.map((d) => ({
                    value: d.value ?? d.id,
                    label: d.label ?? d.name,
                  }));
                })()}
                value={
                  selectDepartment
                    ? {
                        value: selectDepartment.id,
                        label: selectDepartment.name,
                      }
                    : null
                }
                onChange={(opt) => {
                  if (!opt) {
                    setSelectDepartmentState(null);
                    setDepartment(null);
                  } else {
                    const deptObj = {
                      id: opt.value,
                      name: opt.label,
                      value: opt.value,
                      label: opt.label,
                    };
                    setSelectDepartmentState(deptObj);
                    setDepartment(deptObj);
                  }
                }}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                    boxShadow: state.isFocused
                      ? "0 0 0 1px #3b82f6"
                      : "0 1px 2px 0 rgba(0,0,0,0.05)",
                    backgroundColor: state.isDisabled
                      ? "#f3f4f6"
                      : "#ffffff",
                    minHeight: "36px",
                    height: "36px",
                    fontSize: "0.8125rem",
                    cursor: state.isDisabled ? "not-allowed" : "pointer",
                    "&:hover": {
                      borderColor: state.isDisabled ? "#d1d5db" : "#9ca3af",
                    },
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#6b7280",
                    fontSize: "0.8125rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "#1f2937",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    height: "36px",
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 50,
                    borderRadius: "0.5rem",
                  }),
                }}
              />
            </div>

            {/* Clear Filters Button (if active) */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearQuery}
                title="ล้างตัวกรองทั้งหมด"
                className="h-[36px] px-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <X size={14} />
                <span>ล้างตัวกรอง ({activeFilterCount})</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* ================= MAIN DASHBOARD BODY ================= */}
      <main className="w-full px-4 sm:px-8 pt-6 flex flex-col gap-6">
        {/* ================= 12 STATS CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: ศิษย์เก่าทั้งหมด */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-blue-500 shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium">
                ศิษย์เก่าทั้งหมด
              </p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {Number(headerData?.allAlumni || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">คน</p>
            </div>
            <div className="w-11 h-11 rounded-full border border-blue-400 bg-blue-50/50 flex items-center justify-center text-blue-500 shrink-0">
              <Users size={20} />
            </div>
          </div>

          {/* Card 2: ศิษย์เก่าปัจจุบันมีงานทำ */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-emerald-500 shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium">
                ศิษย์เก่าปัจจุบันมีงานทำ
              </p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {Number(headerData?.alumniWorking || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">คน</p>
            </div>
            <div className="w-11 h-11 rounded-full border border-emerald-400 bg-emerald-50/50 flex items-center justify-center text-emerald-500 shrink-0">
              <Check size={20} />
            </div>
          </div>

          {/* Card 3: เงินเดือนเฉลี่ยในปัจจุบันของศิษย์เก่า */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-amber-500 shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium">
                เงินเดือนเฉลี่ยในปัจจุบันของศิษย์เก่า
              </p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {Number(
                  Math.round(headerData?.salaryAvg || 0),
                ).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">บาท</p>
            </div>
            <div className="w-11 h-11 rounded-full border border-amber-400 bg-amber-50/50 flex items-center justify-center text-amber-500 shrink-0">
              <Coins size={20} />
            </div>
          </div>

          {/* Card 4: ศิษย์เก่าที่ปัจจุบันกำลังศึกษาต่อ */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-stone-600 shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium">
                ศิษย์เก่าที่ปัจจุบันกำลังศึกษาต่อ
              </p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {(
                  Number(headerData?.alumniStudy || 0) +
                  Number(headerData?.alumniStudyMax || 0)
                ).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">คน</p>
            </div>
            <div className="w-11 h-11 rounded-full border border-rose-900/40 bg-rose-50/50 flex items-center justify-center text-rose-900 shrink-0">
              <Building2 size={20} />
            </div>
          </div>

          {/* Card 5: ศิษย์เก่าที่เข้าศึกษาต่อในระดับปริญญาโท */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-purple-500 shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium">
                ศิษย์เก่าที่เข้าศึกษาต่อในระดับปริญญาโท
              </p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {Number(headerData?.alumniStudy || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">คน</p>
            </div>
            <div className="w-11 h-11 rounded-full border border-purple-400 bg-purple-50/50 flex items-center justify-center text-purple-500 shrink-0">
              <GraduationCap size={20} />
            </div>
          </div>

          {/* Card 6: ศิษย์เก่าที่เข้าศึกษาต่อในระดับปริญญาเอก */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-pink-400 shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium">
                ศิษย์เก่าที่เข้าศึกษาต่อในระดับปริญญาเอก
              </p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {Number(headerData?.alumniStudyMax || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">คน</p>
            </div>
            <div className="w-11 h-11 rounded-full border border-pink-300 bg-pink-50/50 flex items-center justify-center text-pink-400 shrink-0">
              <GraduationCap size={20} />
            </div>
          </div>

          {/* Card 7: อาชีพยอดนิยม */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-slate-700 shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium">
                อาชีพยอดนิยม
              </p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1 truncate max-w-[170px]">
                {populationJob?.[0]?.name ||
                  headerData?.mostPopularJob ||
                  "ไม่พบข้อมูล"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {populationJob?.[0]?.name
                  ? `${populationJob?.[0]?.count} คน`
                  : "ไม่พบข้อมูล"}
              </p>
            </div>
            <div className="w-11 h-11 rounded-full border border-slate-700 bg-slate-50 flex items-center justify-center text-slate-700 shrink-0">
              <Briefcase size={20} />
            </div>
          </div>

          {/* Card 8: จังหวัดที่ศิษย์เก่าอยู่มากที่สุด */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-indigo-600 shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium">
                จังหวัดที่ศิษย์เก่าอยู่มากที่สุด
              </p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1 truncate max-w-[170px]">
                {mostLiverPercent?.result?.[0]?.company_place ||
                  mostLiverPercent?.result?.[0]?.name ||
                  headerData?.mostLiveProvince ||
                  "ไม่พบข้อมูล"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {mostLiverPercent?.result?.[0]?.percent
                  ? `${mostLiverPercent?.result?.[0]?.percent}%`
                  : "ไม่พบข้อมูล"}
              </p>
            </div>
            <div className="w-11 h-11 rounded-full border border-indigo-400 bg-indigo-50/50 flex items-center justify-center text-indigo-600 shrink-0">
              <MapPinHouse size={20} />
            </div>
          </div>

          {/* Card 9: จังหวัดที่ศิษย์เก่าทำงานมากที่สุด */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-red-500 shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium">
                จังหวัดที่ศิษย์เก่าทำงานมากที่สุด
              </p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1 truncate max-w-[170px]">
                {mostLiverPercent?.result?.[0]?.company_place ||
                  mostLiverPercent?.result?.[0]?.name ||
                  headerData?.mostWorkProvince ||
                  "ไม่พบข้อมูล"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {mostLiverPercent?.result?.[0]?.percent
                  ? `${mostLiverPercent?.result?.[0]?.percent}%`
                  : "ไม่พบข้อมูล"}
              </p>
            </div>
            <div className="w-11 h-11 rounded-full border border-red-400 bg-red-50/50 flex items-center justify-center text-red-500 shrink-0">
              <Building2 size={20} />
            </div>
          </div>

          {/* Card 10: รับเงินเดือนสูงที่สุดในปัจจุบัน */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-emerald-500 shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium">
                รับเงินเดือนสูงที่สุดในปัจจุบัน
              </p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {Number(
                  Math.round(headerData?.mostSalary || 0),
                ).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">บาท</p>
            </div>
            <div className="w-11 h-11 rounded-full border border-emerald-400 bg-emerald-50/50 flex items-center justify-center text-emerald-500 shrink-0">
              <DollarSign size={20} />
            </div>
          </div>

          {/* Card 11: ศิษย์เก่าที่ไปศึกษาต่อที่ต่างประเทศ */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-amber-500 shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium">
                ศิษย์เก่าที่ไปศึกษาต่อที่ต่างประเทศ
              </p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {Number(headerData?.studyOtherCountry || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">คน</p>
            </div>
            <div className="w-11 h-11 rounded-full border border-amber-400 bg-amber-50/50 flex items-center justify-center text-amber-500 shrink-0">
              <FaPlaneDeparture size={18} />
            </div>
          </div>

          {/* Card 12: ศิษย์เก่าที่เคยทำงานอยู่ต่างประเทศ */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-blue-600 shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium">
                ศิษย์เก่าที่เคยทำงานอยู่ต่างประเทศ
              </p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {Number(headerData?.countryWork || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">คน</p>
            </div>
            <div className="w-11 h-11 rounded-full border border-blue-400 bg-blue-50/50 flex items-center justify-center text-blue-600 shrink-0">
              <Globe size={20} />
            </div>
          </div>
        </div>

        {/* ================= EMPLOYMENT BAR CHART ================= */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm md:text-base">
              แผนภูมิแท่งแสดงภาพรวมการมีงานทำของแต่ละ
              {selectFaculty ? "สาขา" : "คณะ"}
            </h3>

            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#0284C7]" />
                <span className="text-gray-700">
                  ทำงาน (
                  {Number(headerData?.alumniWorking || 0).toLocaleString()}{" "}
                  คน)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#F97316]" />
                <span className="text-gray-700">
                  ว่างงาน/ไม่พบข้อมูล (
                  {Math.max(
                    0,
                    Number(headerData?.allAlumni || 0) -
                      Number(headerData?.alumniWorking || 0),
                  ).toLocaleString()}{" "}
                  คน)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            {loadingCharts ? (
              <ChartSkeleton height={360} />
            ) : (
              <ChartSimple
                data={chartbarData}
                key1="working"
                color1="#0284C7"
                key2="unemployed"
                color2="#F97316"
                height={360}
              />
            )}
          </div>
        </div>

        {/* ================= 3. SALARY & PROFILE COMPLETENESS ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donut Chart: Salary Distribution */}
          {(!selectDepartment || user?.roleId >= 3) && (
            <FadeInSection className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-md flex flex-col">
              <div className="pb-3 border-b border-slate-100 mb-2">
                <h3 className="font-bold text-slate-800 text-sm md:text-base">
                  สัดส่วนเงินเดือนเฉลี่ย
                </h3>
                <p className="text-xs text-slate-400">
                  เปรียบเทียบในแต่ละ{selectFaculty ? "สาขาวิชา" : "คณะ"}
                </p>
              </div>

              {loadingCharts ? (
                <ChartSkeleton height={320} />
              ) : (
                <PieChartComponent data={pieData} openToolTip={true} />
              )}
            </FadeInSection>
          )}

          {/* Donut Chart: Domestic vs International Work */}
          <FadeInSection className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-md flex flex-col">
            <div className="pb-3 border-b border-slate-100 mb-2">
              <h3 className="font-bold text-slate-800 text-sm md:text-base">
                สัดส่วนการทำงานใน/ต่างประเทศ
              </h3>
              <p className="text-xs text-slate-400">การกระจายตัวของศิษย์เก่าที่มีงานทำ</p>
            </div>

            {loadingCharts ? (
              <ChartSkeleton height={320} />
            ) : (
              <WorkPlaceRatePieChartComponent
                data={pieWorkRate}
                openToolTip={true}
              />
            )}
          </FadeInSection>

          {/* Incomplete Profiles / Missing Work Data List */}
          <FadeInSection className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">
                    ยังไม่พบข้อมูลการทำงาน
                  </h3>
                  <p className="text-xs text-slate-400">ศิษย์เก่าที่ยังไม่ได้ระบุสถานะงาน</p>
                </div>

                {noWorkData?.length > 0 && (
                  <button
                    onClick={() => {
                      setPrevPath("/users/dashboard");
                      router.push("/users/dashboard/list-no-data");
                    }}
                    title="ดูรายชื่อทั้งหมด"
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                  >
                    <span>ดูทั้งหมด</span>
                    <ChevronRight size={15} />
                  </button>
                )}
              </div>

              {/* List container */}
              <div className="w-full flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                {headerData?.allAlumni < 1 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    <NoData bg={2} />
                  </div>
                ) : noWorkData.length > 0 ? (
                  user?.roleId < 3 || selectDepartment ? (
                    alumniNoWorkList.map((a, index) => (
                      <button
                        onClick={() => {
                          setPrevPath("/users/dashboard");
                          router.push(`/users/search/${a?.alumni_id}/1`);
                        }}
                        key={index}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/60 transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200">
                            <Image
                              alt="profile"
                              width={40}
                              height={40}
                              src={
                                a?.profile
                                  ? apiConfig.imgAPI + a?.profile
                                  : NO_PROFILE_IMG
                              }
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                              {a?.prefix}
                              {a?.fname} {a?.lname}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              รหัสนักศึกษา: {a?.alumni_id}
                            </span>
                          </div>
                        </div>
                        <ArrowUpRight
                          size={14}
                          className="text-slate-300 group-hover:text-blue-500 transition-colors"
                        />
                      </button>
                    ))
                  ) : (
                    noWorkData.map((r, index) => {
                      const name =
                        user?.roleId < 3 || selectFaculty
                          ? getDepartmentName(r?.departmentId)
                          : getFacultyName(r?.facultyId);
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <UserX size={14} className="text-slate-400 shrink-0" />
                            <span className="truncate text-slate-700 font-medium">
                              {name}
                            </span>
                          </div>
                          <span className="font-bold text-amber-600 shrink-0">
                            {r?._count?.alumni_id} คน
                          </span>
                        </div>
                      );
                    })
                  )
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center gap-2 text-emerald-600">
                    <CheckCircle2 size={42} className="text-emerald-500" />
                    <p className="text-xs font-bold text-slate-700">
                      ศิษย์เก่าทุกคนกรอกข้อมูลครบถ้วน
                    </p>
                  </div>
                )}
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* ================= 4. GEOGRAPHIC & CAREER PATHS ================= */}
        <section className="flex flex-col gap-6">
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-800">
              การกระจายตัวเชิงพื้นที่และอาชีพยอดนิยม (Geographic & Careers)
            </h2>
            <p className="text-xs text-slate-500">
              พื้นที่การทำงาน แหล่งจ้างงาน และสายอาชีพที่ศิษย์เก่าปฏิบัติงานมากที่สุด
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Employment Provinces Area Chart */}
            <FadeInSection className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-md flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">
                    10 อันดับจังหวัดที่ศิษย์เก่าทำงานมากที่สุด
                  </h3>
                  <p className="text-xs text-slate-400">เรียงตามจำนวนศิษย์เก่าในแต่ละจังหวัด</p>
                </div>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <MapPin size={16} />
                </div>
              </div>

              {loadingCharts ? (
                <ChartSkeleton height={320} />
              ) : (
                <LineChartComponent
                  data={(mostLiverPercent?.result || []).map((d) => ({
                    company_place: d?.company_place || "ไม่ระบุ",
                    value: Number(d?._count?.alumniId) || 0,
                  }))}
                />
              )}
            </FadeInSection>

            {/* Top International Destinations Column Chart */}
            <FadeInSection className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-md flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">
                    ประเทศที่ศิษย์เก่าไปทำงานมากที่สุด
                  </h3>
                  <p className="text-xs text-slate-400">สถิติการทำงานในต่างประเทศ</p>
                </div>
                <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                  <Globe size={16} />
                </div>
              </div>

              {loadingCharts ? (
                <ChartSkeleton height={320} />
              ) : (
                <AlumniColumnChart rawData={otherCountryList} />
              )}
            </FadeInSection>
          </div>

          {/* Top Popular Job Positions Bar Chart */}
          <FadeInSection className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-md flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-2">
              <div>
                <h3 className="font-bold text-slate-800 text-sm md:text-base">
                  10 อันดับตำแหน่งงานและสายอาชีพยอดนิยม
                </h3>
                <p className="text-xs text-slate-400">ตำแหน่งงานที่ศิษย์เก่าประกอบอาชีพในปัจจุบัน</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-3 h-3 rounded-md bg-[#F59E0B]" />
                <span className="text-slate-600 font-medium">จำนวนศิษย์เก่า (คน)</span>
              </div>
            </div>

            {loadingCharts ? (
              <ChartSkeleton height={360} />
            ) : populationJob.length > 0 ? (
              <ChartSimple
                color1="#F59E0B"
                key1="count"
                data={populationJob}
                height={360}
              />
            ) : (
              <div className="w-full h-72 flex flex-col items-center justify-center text-slate-400 gap-2">
                <FaFolderOpen size={36} className="opacity-40" />
                <p className="text-sm font-medium">ยังไม่มีข้อมูลอาชีพยอดนิยม</p>
              </div>
            )}
          </FadeInSection>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
