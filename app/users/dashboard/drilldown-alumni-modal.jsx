"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import ExportExcel from "@/libs/export-excel";
import Image from "next/image";
import SafeImage from "@/components/safe-image";
import { NO_PROFILE_IMG } from "../profile/alumni-profile";
import { TableSkeleton } from "@/components/skeletons";
import {
  X,
  Search,
  FileSpreadsheet,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Briefcase,
  UserX,
  Building,
  MapPin,
  DollarSign,
  GraduationCap,
  Users,
} from "lucide-react";

export default function DrilldownAlumniModal({
  isOpen,
  onClose,
  title = "รายชื่อศิษย์เก่า",
  subtitle = "",
  params = {},
  filterParams = {},
  faculties = [],
  departments = [],
}) {
  const mergedParams = useMemo(() => ({ ...filterParams, ...params }), [params, filterParams]);
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusTab, setStatusTab] = useState(mergedParams.workStatus || "all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const take = 10;

  // Sync statusTab when mergedParams.workStatus changes
  useEffect(() => {
    if (mergedParams.workStatus) {
      setStatusTab(mergedParams.workStatus);
    } else {
      setStatusTab("all");
    }
  }, [mergedParams.workStatus, isOpen]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Helper name resolvers
  const getFacultyName = useCallback(
    (id) => {
      if (!id) return "-";
      const f = (faculties || []).find(
        (item) => String(item.value ?? item.id) === String(id),
      );
      return f?.label ?? f?.name ?? `คณะ (${id})`;
    },
    [faculties],
  );

  const getDepartmentName = useCallback(
    (id) => {
      if (!id) return "-";
      const d = (departments || []).find(
        (item) => String(item.value ?? item.id) === String(id),
      );
      return d?.label ?? d?.name ?? `สาขา (${id})`;
    },
    [departments],
  );

  // Fetch alumni
  const fetchAlumni = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const queryParams = {
        ...mergedParams,
        workStatus: statusTab !== "all" ? statusTab : undefined,
        search: debouncedSearch.trim() || undefined,
        page,
        take,
      };

      const res = await axios.get(
        apiConfig.rmuAPI + "/dashboard/drilldown-alumni",
        {
          withCredentials: true,
          params: queryParams,
        },
      );

      if (res.status === 200) {
        setAlumniList(res.data?.list || []);
        setTotal(res.data?.total || 0);
        setTotalPage(res.data?.totalPage || 1);
      }
    } catch (err) {
      console.error("fetchAlumni error:", err);
      alerts.err("ไม่สามารถโหลดรายชื่อศิษย์เก่าได้");
    } finally {
      setLoading(false);
    }
  }, [isOpen, mergedParams, statusTab, debouncedSearch, page, take]);

  useEffect(() => {
    if (isOpen) {
      fetchAlumni();
    }
  }, [isOpen, fetchAlumni]);

  // Reset page when tab changes
  const handleTabChange = (tab) => {
    setStatusTab(tab);
    setPage(1);
  };

  // Export all matching records to Excel
  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const queryParams = {
        ...params,
        workStatus: statusTab !== "all" ? statusTab : undefined,
        search: debouncedSearch.trim() || undefined,
        exportAll: true,
      };

      const res = await axios.get(
        apiConfig.rmuAPI + "/dashboard/drilldown-alumni",
        {
          withCredentials: true,
          params: queryParams,
        },
      );

      const dataToExport = res.data?.list || [];
      if (!dataToExport.length) {
        alerts.err("ไม่มีข้อมูลสำหรับส่งออก");
        return;
      }

      const formatted = dataToExport.map((a, index) => {
        const currentWork = a.work_expreriences?.[0];
        const isWorking = Boolean(currentWork && currentWork.isCurrent);
        return {
          ลำดับ: index + 1,
          รหัสนักศึกษา: a.alumni_id || "-",
          คำนำหน้า: a.prefix || "",
          ชื่อ: a.fname || "",
          นามสกุล: a.lname || "",
          ระดับการศึกษา: a.edu_level?.edu_level_name || "-",
          คณะ: getFacultyName(a.facultyId),
          สาขาวิชา: getDepartmentName(a.departmentId),
          ปีการศึกษาที่เข้า: a.year_start || "-",
          ปีการศึกษาที่จบ: a.year_end || "-",
          สถานะการมีงานทำ: isWorking ? "มีงานทำ" : "ว่างงาน / ไม่ระบุ",
          ตำแหน่งงาน: currentWork?.job_position || "-",
          สถานประกอบการ: currentWork?.company_name || "-",
          สถานที่ทำงาน: currentWork?.company_place || "-",
          ประเทศ: currentWork?.isInThai
            ? "ไทย"
            : currentWork?.country || "ต่างประเทศ",
          "เงินเดือน (บาท)": currentWork?.salary
            ? Number(currentWork.salary).toLocaleString()
            : "-",
          เบอร์โทรศัพท์: a.tel || "-",
          อีเมล: a.email || "-",
        };
      });

      const safeTitle = (title || "รายงานรายชื่อศิษย์เก่า")
        .replace(/[/\\?%*:|"<>]/g, "-")
        .trim();
      const filename = `${safeTitle}_${new Date().toISOString().slice(0, 10)}`;
      ExportExcel(formatted, filename);
    } catch (err) {
      console.error("Export Excel error:", err);
      alerts.err("เกิดข้อผิดพลาดในการส่งออกไฟล์ Excel");
    } finally {
      setExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* ================= MODAL HEADER ================= */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/70">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight truncate">
                {title}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                {total.toLocaleString()} คน
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-1 truncate">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Export Excel Button */}
            <button
              onClick={handleExportExcel}
              disabled={exporting || total === 0}
              className="h-9 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="ส่งออกรายชื่อเป็นไฟล์ Excel"
            >
              {exporting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <FileSpreadsheet size={15} />
              )}
              <span className="hidden sm:inline">
                {exporting ? "กำลังส่งออก..." : "ส่งออก Excel"}
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              title="ปิด"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ================= TOOLBAR & SEARCH ================= */}
        <div className="p-3.5 sm:px-5 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
            <button
              onClick={() => handleTabChange("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusTab === "all"
                  ? "bg-white text-slate-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => handleTabChange("working")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusTab === "working"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              มีงานทำ
            </button>
            <button
              onClick={() => handleTabChange("unemployed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusTab === "unemployed"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ว่างงาน/ไม่ระบุ
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหารหัสนักศึกษา หรือชื่อ-สกุล..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* ================= ALUMNI TABLE ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {loading ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <TableSkeleton rows={7} />
            </div>
          ) : alumniList.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-400 text-center">
              <Users size={40} className="opacity-30" />
              <p className="text-sm font-semibold text-slate-600">
                ไม่พบรายชื่อศิษย์เก่า
              </p>
              <p className="text-xs text-slate-400">
                ไม่มีข้อมูลที่ตรงกับเงื่อนไขตัวกรองในขณะนี้
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3 w-12 text-center">#</th>
                    <th className="py-2.5 px-3 min-w-[200px]">ศิษย์เก่า</th>
                    <th className="py-2.5 px-3 min-w-[130px]">รหัสนักศึกษา</th>
                    <th className="py-2.5 px-3 min-w-[150px]">สาขาวิชา/คณะ</th>
                    <th className="py-2.5 px-3 min-w-[110px] text-center">
                      สถานะ
                    </th>
                    <th className="py-2.5 px-3 min-w-[170px]">
                      ตำแหน่งงาน / สถานที่
                    </th>
                    <th className="py-2.5 px-3 min-w-[100px] text-right">
                      เงินเดือน
                    </th>
                    <th className="py-2.5 px-3 w-14 text-center">โปรไฟล์</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alumniList.map((alumni, index) => {
                    const rowNumber = (page - 1) * take + index + 1;
                    const work = alumni.work_expreriences?.[0];
                    const isWorking = Boolean(work && work.isCurrent);

                    return (
                      <tr
                        key={alumni.alumni_id || index}
                        className="hover:bg-blue-50/40 transition-colors"
                      >
                        {/* Index */}
                        <td className="py-2.5 px-3 text-center text-slate-400 font-medium">
                          {rowNumber}
                        </td>

                        {/* Profile & Name */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                              <SafeImage
                                alt="avatar"
                                width={32}
                                height={32}
                                type="avatar"
                                src={
                                  alumni.profile
                                    ? apiConfig.imgAPI + alumni.profile
                                    : NO_PROFILE_IMG
                                }
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-slate-800 truncate">
                                {alumni.prefix}
                                {alumni.fname} {alumni.lname}
                              </span>
                              <span className="text-[11px] text-slate-400 truncate">
                                {alumni.edu_level?.edu_level_name ||
                                  "ระดับปริญญาตรี"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Student ID & Class Year */}
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col">
                            <span className="font-mono font-semibold text-slate-700">
                              {alumni.alumni_id}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              ปี {alumni.year_start || "-"} -{" "}
                              {alumni.year_end || "-"}
                            </span>
                          </div>
                        </td>

                        {/* Department & Faculty */}
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-slate-700 truncate">
                              {getDepartmentName(alumni.departmentId)}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate">
                              {getFacultyName(alumni.facultyId)}
                            </span>
                          </div>
                        </td>

                        {/* Employment Status Badge */}
                        <td className="py-2.5 px-3 text-center">
                          {isWorking ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                              มีงานทำ
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700">
                              ว่างงาน/ไม่ระบุ
                            </span>
                          )}
                        </td>

                        {/* Job & Workplace */}
                        <td className="py-2.5 px-3">
                          {isWorking ? (
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium text-slate-800 truncate">
                                {work.job_position || "ไม่ระบุตำแหน่ง"}
                              </span>
                              <span className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                                <Building size={11} className="shrink-0" />
                                {work.company_name || "-"}
                                {work.company_place && ` (${work.company_place})`}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">
                              -
                            </span>
                          )}
                        </td>

                        {/* Salary */}
                        <td className="py-2.5 px-3 text-right">
                          {isWorking && work.salary ? (
                            <span className="font-semibold text-slate-800">
                              ฿{Number(work.salary).toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>

                        {/* Profile Link */}
                        <td className="py-2.5 px-3 text-center">
                          <a
                            href={`/users/search/${alumni.alumni_id}/1`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 inline-flex items-center justify-center transition-colors"
                            title="ดูโปรไฟล์แบบเต็ม"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ================= PAGINATION FOOTER ================= */}
        {total > 0 && (
          <div className="p-3 sm:px-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
            <div>
              แสดง {(page - 1) * take + 1} - {Math.min(page * take, total)} จาก{" "}
              {total.toLocaleString()} คน
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ChevronLeft size={14} />
                <span>ก่อนหน้า</span>
              </button>

              <span className="font-semibold text-slate-800 px-2">
                {page} / {totalPage}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                disabled={page >= totalPage}
                className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>ถัดไป</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
