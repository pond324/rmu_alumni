"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { useFacultyDep } from "@/hook/useFacultyDep";
import {
  X,
  Briefcase,
  Users,
  UserX,
  ArrowRight,
  Layers,
  PieChart,
} from "lucide-react";
import { Skeleton } from "@/components/skeletons";

export default function DrilldownFacultyModal({
  isOpen,
  onClose,
  faculty, // { id, name, count, working, unemployed }
  departmentsLookup = [],
  filterParams = {}, // { selectYearStart, selectYearEnd, selectEduLevel, selectGender }
  onSelectDepartment, // (department, workStatus) => void
}) {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [totals, setTotals] = useState({ total: 0, working: 0, unemployed: 0 });

  // Fallback to hook if departmentsLookup is not provided
  const { departments: hookDepartments } = useFacultyDep();
  const allDepartments = useMemo(() => {
    if (departmentsLookup && departmentsLookup.length > 0) {
      return departmentsLookup;
    }
    return hookDepartments || [];
  }, [departmentsLookup, hookDepartments]);

  // Helper to format & resolve Thai department name
  const getDeptName = (id, fallbackName) => {
    if (
      fallbackName &&
      typeof fallbackName === "string" &&
      fallbackName.trim().length > 0 &&
      !fallbackName.startsWith("(") &&
      !fallbackName.startsWith("สาขาวิชา (")
    ) {
      return fallbackName.startsWith("สาขาวิชา")
        ? fallbackName
        : `สาขาวิชา${fallbackName}`;
    }

    const found = (allDepartments || []).find(
      (d) =>
        String(d?.value) === String(id) ||
        String(d?.id) === String(id) ||
        String(d?.department_id) === String(id)
    );

    const name = found?.department_name || found?.label || found?.name;
    if (name) {
      return name.startsWith("สาขาวิชา") ? name : `สาขาวิชา${name}`;
    }

    return id ? `สาขาวิชา (${id})` : "ไม่ระบุสาขาวิชา";
  };

  useEffect(() => {
    if (!isOpen || !faculty?.id) return;

    const fetchDepartmentBreakdown = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("facultyId", faculty.id);
        if (filterParams.selectYearStart)
          params.append("selectYearStart", filterParams.selectYearStart);
        if (filterParams.selectYearEnd)
          params.append("selectYearEnd", filterParams.selectYearEnd);
        if (filterParams.selectEduLevel)
          params.append("selectEduLevel", filterParams.selectEduLevel);
        if (filterParams.selectGender)
          params.append("selectGender", filterParams.selectGender);

        const res = await axios.get(
          `${apiConfig.rmuAPI}/dashboard/chart-bar-data?${params.toString()}`,
          { withCredentials: true }
        );
        const data = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || [];
        setDepartments(data);

        // Calculate totals
        const sumWorking = data.reduce(
          (acc, d) => acc + (Number(d.working) || 0),
          0
        );
        const sumUnemployed = data.reduce(
          (acc, d) => acc + (Number(d.unemployed) || 0),
          0
        );
        setTotals({
          total: sumWorking + sumUnemployed,
          working: sumWorking,
          unemployed: sumUnemployed,
        });
      } catch (err) {
        console.error("Error fetching department breakdown:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentBreakdown();
  }, [isOpen, faculty, filterParams]);

  if (!isOpen || !faculty) return null;

  const workingRate =
    totals.total > 0 ? ((totals.working / totals.total) * 100).toFixed(1) : 0;

  const handleSelect = (dept, status) => {
    const resolvedName = getDeptName(dept.id, dept.name);
    onSelectDepartment(
      {
        ...dept,
        name: resolvedName,
      },
      status
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* ================= MODAL HEADER (Blue-White Theme) ================= */}
        <div className="flex items-start justify-between p-5 sm:p-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-blue-100 text-xs font-medium tracking-wide mb-2">
              <Layers className="w-3.5 h-3.5 text-blue-200" />
              <span>ภาพรวมการมีงานทำระดับสาขาวิชา</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {faculty.name || "คณะ"}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1">
              คลิกที่แต่ละสาขาวิชาเพื่อดูรายชื่อนักศึกษาและส่งออกรายงานข้อมูล
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= OVERVIEW STATS BADGES ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 sm:p-5 bg-slate-50 border-b border-slate-200/80">
          <div className="bg-white rounded-xl p-4 border border-blue-100/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                นักศึกษาทั้งหมดในคณะ
              </p>
              <p className="text-xl font-bold text-slate-900">
                {totals.total.toLocaleString()}{" "}
                <span className="text-xs font-normal text-slate-500">คน</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-emerald-100/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                มีงานทำ (อัตรา {workingRate}%)
              </p>
              <p className="text-xl font-bold text-emerald-600">
                {totals.working.toLocaleString()}{" "}
                <span className="text-xs font-normal text-slate-500">คน</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-amber-100/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                ว่างงาน / ศึกษาต่อ / ไม่ระบุ
              </p>
              <p className="text-xl font-bold text-amber-600">
                {totals.unemployed.toLocaleString()}{" "}
                <span className="text-xs font-normal text-slate-500">คน</span>
              </p>
            </div>
          </div>
        </div>

        {/* ================= DEPARTMENT LIST ================= */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3 bg-slate-50/50">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-700">
              รายชื่อสาขาวิชาในคณะ ({departments.length} สาขา)
            </h3>
            <span className="text-xs text-slate-500">
              * เลือกปุ่มสถานะหรือกดทั้งแถวเพื่อดูรายชื่อนักศึกษา
            </span>
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-48 rounded" />
                      <Skeleton className="h-4 w-14 rounded-full" />
                    </div>
                    <Skeleton className="h-2 w-full max-w-md rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-24 rounded-lg" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                    <Skeleton className="h-8 w-16 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : departments.length === 0 ? (
            <div className="py-16 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
              <PieChart className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm">ไม่พบข้อมูลสาขาวิชาสำหรับเงื่อนไขที่เลือก</p>
            </div>
          ) : (
            departments.map((dept, idx) => {
              const deptWorking = Number(dept.working) || 0;
              const deptUnemployed = Number(dept.unemployed) || 0;
              const deptTotal = deptWorking + deptUnemployed;
              const deptPercent =
                deptTotal > 0
                  ? ((deptWorking / deptTotal) * 100).toFixed(1)
                  : 0;
              const displayName = getDeptName(dept.id, dept.name);

              return (
                <div
                  key={dept.id || idx}
                  className="group bg-white hover:bg-blue-50/30 border border-slate-200 hover:border-blue-300 rounded-xl p-4 transition-all duration-200 shadow-xs hover:shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Dept name & progress */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                          #{idx + 1}
                        </span>
                        <h4 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {displayName}
                        </h4>
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="mt-2.5 max-w-md">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>
                            อัตรามีงานทำ:{" "}
                            <b className="text-blue-600">{deptPercent}%</b>
                          </span>
                          <span>
                            {deptWorking}/{deptTotal} คน
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                          <div
                            className="bg-blue-600 h-full transition-all duration-500"
                            style={{ width: `${deptPercent}%` }}
                            title={`มีงานทำ: ${deptWorking} คน`}
                          />
                          <div
                            className="bg-amber-400 h-full transition-all duration-500"
                            style={{ width: `${100 - Number(deptPercent)}%` }}
                            title={`ว่างงาน: ${deptUnemployed} คน`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleSelect(dept, "working")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="ดูเฉพาะนักศึกษาที่มีงานทำ"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>มีงานทำ ({deptWorking})</span>
                      </button>

                      <button
                        onClick={() => handleSelect(dept, "unemployed")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="ดูเฉพาะนักศึกษาที่ว่างงาน/ศึกษาต่อ"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>ว่างงาน ({deptUnemployed})</span>
                      </button>

                      <button
                        onClick={() => handleSelect(dept, "all")}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="ดูรายชื่อทั้งหมดและส่งออก"
                      >
                        <span>ดูรายชื่อทั้งหมด ({deptTotal})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ================= MODAL FOOTER ================= */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row gap-2 justify-between items-center text-xs text-slate-500">
          <span>คลิกปุ่มเพื่อเปิดรายชื่อนักศึกษาและกดส่งออกไฟล์ Excel (.xlsx) ได้ทันที</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer border border-slate-200"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
