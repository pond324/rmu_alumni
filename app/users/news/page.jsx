"use client";

import Image from "next/image";
import logo from "@/assets/images/logo_rmu.png";
import {
  Calendar,
  Calendar1,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Filter,
  HandCoins,
  Newspaper,
  RotateCcw,
  University,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import FadeInSection from "@/components/fade-in-section";
import NewsAvtivity from "./news-activity";
import { NewsCardSkeleton } from "@/components/skeletons";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import Loading from "@/components/loading";
import { v4 as uuid } from "uuid";

const MONTHS = [
  { id: 1, name: "มกราคม" },
  { id: 2, name: "กุมภาพันธ์" },
  { id: 3, name: "มีนาคม" },
  { id: 4, name: "เมษายน" },
  { id: 5, name: "พฤษภาคม" },
  { id: 6, name: "มิถุนายน" },
  { id: 7, name: "กรกฎาคม" },
  { id: 8, name: "สิงหาคม" },
  { id: 9, name: "กันยายน" },
  { id: 10, name: "ตุลาคม" },
  { id: 11, name: "พฤศจิกายน" },
  { id: 12, name: "ธันวาคม" },
];

const Page = () => {
  const [searchDate, setSearchDate] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [searchType, setSearchType] = useState("0");
  const [sort, setSort] = useState(JSON.stringify({ createdAt: "desc" }));
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [take, setTake] = useState(12);
  const [searchCategory, setSearchCategory] = useState(0);
  const [newsDonation, setNewsDonation] = useState([]);

  const forwardPage = () => {
    if (page >= totalPage) return;
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page <= 1) return;
    setPage(page - 1);
  };

  const resetAllSearch = () => {
    setPage(1);
    setSort(JSON.stringify({ createdAt: "desc" }));
    setSearchDate("");
    setSearchMonth("");
    setSearchCategory(0);
    setSearchType("0");
  };

  const fetchNewsDonation = async (
    page = 1,
    take = 12,
    sort,
    searchType,
    searchDate,
    searchMonth,
    searchCategory
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-news-donate",
        {
          withCredentials: true,
          params: {
            page,
            take,
            sort,
            searchType,
            searchDate,
            searchMonth,
            searchCategory,
          },
        }
      );
      if (res.status === 200) {
        setNewsDonation(res.data.result || []);
        setTotalPage(res.data.totalPage || 1);
        setTotal(res.data.total || 0);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsDonation(
      page,
      take,
      sort,
      searchType,
      searchDate,
      searchMonth,
      searchCategory
    );
  }, [page, take, sort, searchType, searchDate, searchMonth, searchCategory]);

  const selectedMonthName = MONTHS.find((m) => String(m.id) === String(searchMonth))?.name;

  return (
    <div className="w-full flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <FadeInSection className="flex items-center flex-col sm:flex-row gap-4 pb-5 w-full border-b border-slate-200">
        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 relative flex items-center justify-center">
          <Image
            width={80}
            height={80}
            alt="RMU Logo"
            priority
            src={logo}
            className="w-auto h-auto max-h-full object-contain"
          />
        </div>
        <div className="flex flex-col sm:items-start items-center text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-blue-600 tracking-tight">
            ข่าวสารและการบริจาค
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            ติดตามข่าวสารและกิจกรรมล่าสุดของมหาวิทยาลัย ร่วมสนับสนุนโครงการพัฒนาสถาบันเพื่ออนาคตที่ยั่งยืน
          </p>
        </div>
      </FadeInSection>

      {/* Filter and Controls Toolbar */}
      <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-6 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
        {/* Category Tabs */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            ประเภทรายการ
          </p>
          <div className="flex p-1 bg-slate-100 rounded-xl sm:rounded-full border border-slate-200 w-full sm:w-fit overflow-x-auto no-scrollbar gap-1">
            <button
              onClick={() => {
                setSearchType("0");
                setPage(1);
              }}
              className={`flex items-center justify-center rounded-lg sm:rounded-full text-xs sm:text-sm gap-2 py-2 px-3.5 sm:px-4 font-medium transition-all shrink-0 ${
                searchType === "0"
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <University size={16} />
              <span>ทั้งหมด</span>
            </button>
            <button
              onClick={() => {
                setSearchType("1");
                setPage(1);
              }}
              className={`flex items-center justify-center rounded-lg sm:rounded-full text-xs sm:text-sm gap-2 py-2 px-3.5 sm:px-4 font-medium transition-all shrink-0 ${
                searchType === "1"
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <Newspaper size={16} />
              <span>ข่าวสารและกิจกรรม</span>
            </button>
            <button
              onClick={() => {
                setSearchType("2");
                setPage(1);
              }}
              className={`flex items-center justify-center rounded-lg sm:rounded-full text-xs sm:text-sm gap-2 py-2 px-3.5 sm:px-4 font-medium transition-all shrink-0 ${
                searchType === "2"
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <HandCoins size={16} />
              <span>ร่วมบริจาค</span>
            </button>
          </div>
        </div>

        {/* Date, Month, Sort & Reset Dropdowns */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            ตัวกรองและเรียงลำดับ
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Date */}
            <div title="ค้นหาตามวันที่" className="relative">
              <select
                onChange={(e) => {
                  setSearchDate(e.target.value);
                  setPage(1);
                }}
                value={searchDate}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              >
                <option value="">ทุกวัน</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    วันที่ {d}
                  </option>
                ))}
              </select>
              <div className={`p-2 px-3 rounded-xl border text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-colors ${
                searchDate ? "bg-blue-50 border-blue-300 text-blue-700 font-medium" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}>
                <Calendar1 size={15} />
                <span>{searchDate ? `วันที่ ${searchDate}` : "วันที่"}</span>
              </div>
            </div>

            {/* Filter Month */}
            <div title="ค้นหาตามเดือน" className="relative">
              <select
                onChange={(e) => {
                  setSearchMonth(e.target.value);
                  setPage(1);
                }}
                value={searchMonth}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              >
                <option value="">ทุกเดือน</option>
                {MONTHS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <div className={`p-2 px-3 rounded-xl border text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-colors ${
                searchMonth ? "bg-blue-50 border-blue-300 text-blue-700 font-medium" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}>
                <Calendar size={15} />
                <span>{selectedMonthName || "เดือน"}</span>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div title="เรียงลำดับข้อมูล" className="relative">
              <select
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                value={sort}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              >
                <option value={JSON.stringify({ createdAt: "desc" })}>
                  ล่าสุด
                </option>
                <option value={JSON.stringify({ updatedAt: "desc" })}>
                  แก้ไขล่าสุด
                </option>
                <option value={JSON.stringify({ view: "desc" })}>
                  เข้าชมเยอะสุด
                </option>
              </select>
              <div className="p-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 transition-colors">
                <ChevronsUpDown size={15} />
                <span>เรียง</span>
              </div>
            </div>

            {/* Reset Filter Button */}
            <button
              title="ล้างตัวกรองทั้งหมด"
              onClick={resetAllSearch}
              className="p-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <RotateCcw size={15} />
              <span className="hidden sm:inline">ล้างค่า</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Header & Pagination */}
      <FadeInSection className="mt-8 w-full flex flex-col">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              {searchType === "0"
                ? "ข่าวสาร กิจกรรมและโครงการบริจาคทั้งหมด"
                : searchType === "1"
                ? "ข่าวสารและกิจกรรม"
                : "โครงการบริจาค"}{" "}
              <span className="text-blue-600 font-semibold">({total || 0} รายการ)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              มหาวิทยาลัยราชภัฏมหาสารคาม
            </p>
          </div>

          {/* Pagination Controls */}
          {totalPage > 1 && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={prevPage}
                disabled={page <= 1}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors shadow-2xs"
                title="หน้าก่อนหน้า"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-medium text-slate-600 px-1">
                หน้า {page} / {totalPage}
              </span>
              <button
                onClick={forwardPage}
                disabled={page >= totalPage}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors shadow-2xs"
                title="หน้าถัดไป"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* News Cards Grid */}
        <div className="w-full mt-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          ) : newsDonation.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {newsDonation.map((n) => (
                <NewsAvtivity
                  fetchData={() =>
                    fetchNewsDonation(
                      page,
                      take,
                      sort,
                      searchType,
                      searchDate,
                      searchMonth,
                      searchCategory
                    )
                  }
                  item={n}
                  key={n?.id || uuid()}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
              <Newspaper size={40} className="text-slate-300 mb-1" />
              <p className="text-sm font-medium text-slate-600">
                ไม่พบข้อมูลข่าวสารหรือโครงการบริจาคที่ค้นหา
              </p>
              <p className="text-xs text-slate-400">
                ลองปรับเปลี่ยนคำค้นหา วันที่ หรือกดปุ่ม "ล้างค่า"
              </p>
            </div>
          )}
        </div>

        {/* Bottom Pagination for convenience */}
        {totalPage > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10 pb-6">
            <button
              onClick={prevPage}
              disabled={page <= 1}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-slate-700 transition-colors flex items-center gap-1 shadow-2xs"
            >
              <ChevronLeft size={16} />
              <span>ก่อนหน้า</span>
            </button>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              หน้า {page} จาก {totalPage}
            </span>
            <button
              onClick={forwardPage}
              disabled={page >= totalPage}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-slate-700 transition-colors flex items-center gap-1 shadow-2xs"
            >
              <span>ถัดไป</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </FadeInSection>
    </div>
  );
};

export default Page;
