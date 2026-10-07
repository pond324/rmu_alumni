"use client";

import NewsAvtivity from "@/app/users/news/news-activity";
import DropdownMenu from "@/components/dropdown";
import FadeInSection from "@/components/fade-in-section";
import SafeImage from "@/components/safe-image";
import Loading from "@/components/loading";
import PaginationBtn from "@/components/pageination-btn";
import RowDataNotFound from "@/components/row-data-notfound";
import RowLoader from "@/components/row-loader";
import SearchBox from "@/components/search-box";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import { forwardPage, prevPage } from "@/libs/pagination-helper";
import { DateTHFormat } from "@/libs/thai-local-formate-date";
import axios from "axios";
import { debounce } from "lodash";
import {
  Blocks,
  Box,
  Building2,
  Calendar,
  Calendar1,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  DollarSign,
  Eye,
  EyeClosed,
  Filter,
  FolderOpen,
  Heart,
  HeartHandshake,
  List,
  Loader2,
  Newspaper,
  Paperclip,
  Pen,
  Plus,
  RotateCcw,
  Table,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import ViewDetail from "./view-detail";

const displayFilterText = (filter) => {
  if (!filter || filter === "ทั้งหมด") return "ทั้งหมด";
  const data = JSON.parse(filter).category;
  if (data == "0") return "ข่าวสาร/กิจกรรม";
  return "โครงการบริจาค";
};

const Page = () => {
  const [screenWidth, setScreenWidth] = useState(null);
  useEffect(() => {
    // ตั้งค่า screenWidth ตอนที่อยู่บน client เท่านั้น
    setScreenWidth(window.innerWidth);

    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [searchDate, setSearchDate] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [searchType, setSearchType] = useState("0");
  const [sort, setSort] = useState(JSON.stringify({ createdAt: "desc" }));
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [take, setTake] = useState(10);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(null);
  const [displayType, setDisplayType] = useState(0);

  const resetAllSearch = () => {
    setPage(1);
    setSort(JSON.stringify({ createdAt: "desc" }));
    setSearchDate("");
    setSearchMonth("");
    setSearchType("0");
    setSearch();
  };

  const [loadAvg, setLoadAvg] = useState(false);
  const [avgAll, setAvgAll] = useState(null);
  const getAvg = async () => {
    setLoadAvg(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/all-avg-news",
        { withCredentials: true },
      );
      if (res.status === 200) {
        setAvgAll(res.data);
        // console.log("🚀 ~ getAvg ~ res.data:", res.data)
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoadAvg(false);
    }
  };

  useEffect(() => {
    getAvg();
  }, []);

  const [newsDonation, setNewsDonation] = useState([]);
  const fetchNewsDonation = async (
    page = 1,
    take = 25,
    sort,
    searchType,
    searchDate,
    searchMonth,
    searchCategory,
    search,
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
            search,
          },
        },
      );
      if (res.status === 200) {
        setNewsDonation(res.data.result);
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

  const debounceSearch = useMemo(
    () => debounce(fetchNewsDonation, 500),
    [fetchNewsDonation],
  );

  useEffect(() => {
    debounceSearch(
      page,
      take,
      sort,
      searchType,
      searchDate,
      searchMonth,
      filter,
      search,
    );
  }, [page, take, sort, searchType, searchDate, searchMonth, filter, search]);

  const [deleting, setDeleting] = useState(false);
  const handleDelete = async (id) => {
    const { isConfirmed } = await alerts.confirmDialog(
      "ยืนยันการลบ",
      "คุณต้องการลบข้อมูลนี้? การกระทำนี้ไม่สามารถย้อนกลับได้!",
    );
    if (!isConfirmed) return;
    setDeleting(true);
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI + `/president/delete-news/${id}`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        alerts.success("ลบสำเร็จ!");
        fetchNewsDonation(
          page,
          take,
          sort,
          searchType,
          searchDate,
          searchMonth,
          filter,
          search,
        );
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="w-full p-3 sm:p-5 bg-gray-50 flex flex-col">
        <p className="text-lg sm:text-xl font-bold text-gray-800">จัดการข่าว/โครงการ/บริจาค</p>
        <p className="text-xs sm:text-sm text-gray-600">
          เพิ่ม แก้ไข และจัดการข่าวสารหรือโครงการระดมทุนทั้งหมด
        </p>

        <div className="mt-4 sm:mt-5 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          <FadeInSection
            className={
              "p-3 sm:p-3.5 bg-white flex justify-between items-start border border-gray-200 shadow-2xs rounded-xl"
            }
          >
            <p className="p-2 rounded-lg bg-blue-500 text-white shrink-0">
              <Building2 size={18} />
            </p>
            <span className="flex flex-col justify-end items-end">
              {" "}
              {loadAvg ? (
                <Loader2 className="animate-spin text-blue-500" />
              ) : (
                <p className="text-lg sm:text-xl font-bold text-gray-800">
                  {avgAll?.all?.toLocaleString() || 0}
                </p>
              )}
              <p className="text-xs sm:text-sm text-gray-600 mt-1">ทั้งหมด</p>
            </span>
          </FadeInSection>
          <FadeInSection
            className={
              "p-3 sm:p-3.5 bg-white flex justify-between items-start border border-gray-200 shadow-2xs rounded-xl"
            }
          >
            <p className="p-2 rounded-lg bg-sky-500 text-white shrink-0">
              <Newspaper size={18} />
            </p>
            <span className="flex flex-col justify-end items-end">
              {" "}
              {loadAvg ? (
                <Loader2 className="animate-spin text-sky-500" />
              ) : (
                <p className="text-lg sm:text-xl font-bold text-gray-800">
                  {avgAll?.allNews?.toLocaleString() || 0}
                </p>
              )}
              <p className="text-xs sm:text-sm text-gray-600 mt-1">ข่าวสาร/กิจกรรม</p>
            </span>
          </FadeInSection>
          <FadeInSection
            className={
              "p-3 sm:p-3.5 bg-white flex justify-between items-start border border-gray-200 shadow-2xs rounded-xl"
            }
          >
            <p className="p-2 rounded-lg bg-rose-500 text-white shrink-0">
              <HeartHandshake size={18} />
            </p>
            <span className="flex flex-col justify-end items-end">
              {" "}
              {loadAvg ? (
                <Loader2 className="animate-spin text-rose-500" />
              ) : (
                <p className="text-lg sm:text-xl font-bold text-gray-800">
                  {avgAll?.allDonation?.toLocaleString() || 0}
                </p>
              )}
              <p className="text-xs sm:text-sm text-gray-600 mt-1">โครงการบริจาค</p>
            </span>
          </FadeInSection>
          <FadeInSection
            className={
              "p-3 sm:p-3.5 bg-white flex justify-between items-start border border-gray-200 shadow-2xs rounded-xl"
            }
          >
            <p className="p-2 rounded-lg bg-emerald-500 text-white shrink-0">
              <Eye size={18} />
            </p>
            <span className="flex flex-col justify-end items-end">
              {" "}
              {loadAvg ? (
                <Loader2 className="animate-spin text-emerald-500" />
              ) : (
                <p className="text-lg sm:text-xl font-bold text-gray-800">
                  {avgAll?.allViews?.toLocaleString() || 0}
                </p>
              )}
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                ยอดเข้าชม
              </p>
            </span>
          </FadeInSection>
          <FadeInSection
            className={
              "p-3 sm:p-3.5 bg-white flex justify-between items-start border border-gray-200 shadow-2xs rounded-xl col-span-2 sm:col-span-1"
            }
          >
            <p className="p-2 rounded-lg bg-amber-500 text-white shrink-0">
              <DollarSign size={18} />
            </p>
            <span className="flex flex-col justify-end items-end">
              {" "}
              {loadAvg ? (
                <Loader2 className="animate-spin text-amber-500" />
              ) : (
                <p className="text-lg sm:text-xl font-bold text-gray-800">
                  {avgAll?.allMoney?.toLocaleString() || 0}
                </p>
              )}
              <p className="text-xs sm:text-sm text-gray-600 mt-1">ยอดเงินบริจาคสะสม</p>
            </span>
          </FadeInSection>
        </div>

        <div className="mt-4 sm:mt-5 p-3 sm:p-5 rounded-xl bg-white shadow-2xs border border-gray-200 flex flex-col">
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Paperclip size={18} className="text-blue-500" />
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                รายการข่าว/โครงการทั้งหมด ({total} รายการ)
              </p>
            </span>
            <Link
              href={"/alumni-president/alumni-news/0/add-new-activity"}
              className="p-2 px-3.5 text-xs sm:text-sm w-fit flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
            >
              <Plus size={16} />
              <p>เพิ่มรายการใหม่</p>
            </Link>
          </div>
          <div className="mt-3 w-full flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <div className="w-full lg:w-1/3">
              <SearchBox
                search={search}
                page={page}
                setPage={setPage}
                setSearch={setSearch}
              />
            </div>
            <div title="ประเภท" className="relative inline-block">
              <select
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(1);
                }}
                value={filter}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                <option value={null} className="text-sm">
                  ทั้งหมด
                </option>
                <option
                  value={JSON.stringify({ category: "0" })}
                  className="text-sm"
                >
                  ข่าวสาร/กิจกรรม
                </option>
                <option
                  value={JSON.stringify({ category: "1" })}
                  className="text-sm"
                >
                  โครงการบริจาค
                </option>
              </select>
              <label
                htmlFor="select-row"
                className="p-2 px-3.5 rounded-lg border border-gray-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Filter size={17} />
                <p className="text-sm ">{displayFilterText(filter)}</p>
              </label>
            </div>
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
                <p className="text-sm">แสดง {take} รายการ</p>
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
              onClick={resetAllSearch}
              className="p-2 px-3 rounded-lg text-sm border border-gray-300 shadow-sm flex items-center gap-2"
            >
              <Trash2 size={18} />
              <p>ล้างการค้นหา</p>
            </button>
            <div className="rounded-lg flex items-center shadow-sm border border-gray-300 overflow-hidden">
              <button
                onClick={() => setDisplayType(0)}
                className={`${displayType === 0 && "bg-blue-500 text-white"} p-2`}
              >
                <Table size={18} />
              </button>
              <button
                onClick={() => setDisplayType(1)}
                className={`${displayType === 1 && "bg-blue-500 text-white"} p-2`}
              >
                <Blocks size={18} />
              </button>
            </div>
            <PaginationBtn
              forwardPage={() => forwardPage(page, setPage, totalPage)}
              page={page}
              prevPage={() => prevPage(page, setPage)}
              totalPage={totalPage}
            />
          </div>

          {displayType === 0 ? (
            <div className="mt-3.5 h-[600px] overflow-auto w-full border border-gray-200 rounded-xl">
              <table className="min-w-[760px] w-full">
                <thead>
                  <tr className="bg-blue-50 border-b border-gray-300 shadow-sm sticky top-0 left-0 z-20">
                    <th className="p-2.5 pb-3 text-sm font-normal text-start">
                      หัวข้อ
                    </th>
                    <th className="p-2.5 pb-3 text-sm font-normal text-start">
                      หมวดหมู่
                    </th>
                    <th className="p-2.5 pb-3 text-sm font-normal text-start">
                      สถานะ
                    </th>
                    <th className="p-2.5 pb-3 text-sm font-normal text-start">
                      ยอดบริจาค
                    </th>
                    <th className="p-2.5 pb-3 text-sm font-normal text-start">
                      ผู้ชม
                    </th>
                    <th className="p-2.5 pb-3 text-sm font-normal text-start">
                      แก้ไขล่าสุด
                    </th>
                    <th className="p-2.5 pb-3 text-sm font-normal text-start">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <RowLoader numcol={7} />
                  ) : newsDonation.length < 1 ? (
                    <RowDataNotFound numCol={7} />
                  ) : (
                    newsDonation.map((n, index) => (
                      <tr
                        key={index}
                        className="border-b text-sm border-gray-300 cursor-pointer hover:bg-gray-50"
                      >
                        <td className="p-2.5 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="rounded-lg shadow-md w-13 h-13 overflow-hidden">
                              <SafeImage
                                src={n?.thumnail ? apiConfig.imgAPI + n?.thumnail : ""}
                                type="image"
                                className="w-full h-full object-cover"
                                alt={n?.title || "thumbnail"}
                              />
                            </span>
                            <div className="flex flex-col">
                              <p className="font-semibold w-30 line-clamp-1">
                                {n?.title}
                              </p>
                              <p className="text-sm line-clamp-1 w-80">
                                {n?.short_detail}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-2.5 pb-3">
                          {n?.category == 0 ? (
                            <span className="p-1 px-2 w-fit text-xs bg-blue-50 text-blue-500 rounded-full flex items-center gap-2">
                              <Newspaper size={16} />
                              <p>ข่าวสาร/กิจกรรม</p>
                            </span>
                          ) : (
                            <span className="p-1 px-2 w-fit text-xs bg-red-50 text-red-500 rounded-full flex items-center gap-2">
                              <HeartHandshake size={16} />
                              <p>โครงการบริจาค</p>
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 pb-3">
                          {n?.isPublish ? (
                            <span className="p-1 px-2 w-fit text-xs bg-green-50 text-green-500 rounded-full flex items-center gap-2">
                              <Eye size={16} />
                              <p>เผยแพร่อยู่</p>
                            </span>
                          ) : (
                            <span className="p-1 px-2 w-fit text-xs bg-amber-50 text-amber-500 rounded-full flex items-center gap-2">
                              <EyeClosed size={16} />
                              <p>ฉบับร่าง</p>
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 pb-3">
                          {n?.category == 0 ? (
                            <p>-</p>
                          ) : !n?.donate_end ||
                            n?.donate_end === "undefined" ||
                            n?.donate_end === "null" ||
                            n?.donate_end === "" ? (
                            <span className="p-1 px-2.5 w-fit text-xs bg-gray-100 text-gray-600 rounded-full font-medium inline-block">
                              ไม่รับเงินบริจาค
                            </span>
                          ) : (
                            <>
                              <div className="flex justify-between text-xs mb-1.5">
                                <p>{n?.current_money?.toLocaleString() || 0} ฿</p>

                                <p className="font-semibold">
                                  {n?.target_money > 0
                                    ? `${Math.round(
                                        (n.current_money / n.target_money) * 100,
                                      )}% / ${n.target_money.toLocaleString()} ฿`
                                    : "0%"}
                                </p>
                              </div>

                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-pink-500"
                                  style={{
                                    width: `${
                                      n?.target_money > 0
                                        ? Math.min(
                                            (n.current_money / n.target_money) *
                                              100,
                                            100,
                                          )
                                        : 0
                                    }%`,
                                  }}
                                />
                              </div>
                              <p className="text-xs text-gray-600 mt-1.5">
                                ปิดรับบริจาค: {DateTHFormat(n?.donate_end)}
                              </p>
                            </>
                          )}
                        </td>
                        <td className="p-2.5 pb-3">
                          <p>{n?.view?.toLocaleString() || 0}</p>
                        </td>
                        <td className="p-2.5 pb-3">
                          <p>{DateTHFormat(n?.updatedAt)}</p>
                        </td>
                        <td className="p-2.5 pb-3">
                          <DropdownMenu>
                            <ViewDetail data={n} />
                            <Link
                              href={`/alumni-president/alumni-news/${n?.id}/add-new-activity`}
                              className="p-2 hover:bg-linear-90 hover:text-white hover:from-blue-600 hover:to-sky-300 rounded-lg px-3 text-sm flex items-center gap-2"
                            >
                              <Pen size={18} />
                              <p>แก้ไข</p>
                            </Link>
                            <button
                              onClick={() => handleDelete(n?.id)}
                              disabled={loading || deleting}
                              className="p-2 hover:bg-red-500 text-red-500 hover:text-white 0 rounded-lg px-3 text-sm flex items-center gap-2"
                            >
                              {deleting ? (
                                <>
                                  <Loader2 className="animate-spin" />
                                  <p>กำลังลบ...</p>
                                </>
                              ) : (
                                <>
                                  {" "}
                                  <Trash2 size={18} />
                                  <p>ลบข้อมูล</p>
                                </>
                              )}
                            </button>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-3.5 w-full">
              {loading ? (
                <div className="text-sm gap-2 flex flex-col items-center py-28 text-gray-500">
                  <Loader2 size={35} className="animate-spin text-blue-500" />
                  <p>กำลังโหลด...</p>
                </div>
              ) : newsDonation.length < 1 ? (
                <div className="text-gray-500 text-sm gap-2 flex flex-col items-center py-28">
                  <FolderOpen size={35} />
                  <p>ไม่พบข้อมูล</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {newsDonation.map((n, index) => (
                    <div
                      key={index}
                      className="rounded-xl group border border-gray-200 bg-white shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
                    >
                      <div>
                        {/* Thumbnail Container */}
                        <div className="h-44 w-full relative overflow-hidden bg-gray-100 flex-shrink-0">
                          {/* Badges */}
                          <div className="w-full flex z-10 items-center absolute top-2 left-0 px-2.5 justify-between">
                            {n?.isPublish ? (
                              <span className="p-0.5 px-2 w-fit text-xs bg-green-500 text-white rounded-full flex items-center gap-1.5 shadow-xs">
                                <p>เผยแพร่อยู่</p>
                              </span>
                            ) : (
                              <span className="p-0.5 px-2 w-fit text-xs bg-amber-500 text-white rounded-full flex items-center gap-1.5 shadow-xs">
                                <p>ฉบับร่าง</p>
                              </span>
                            )}
                            {n?.category == 0 ? (
                              <span className="p-0.5 px-2 w-fit text-xs bg-blue-500 text-white rounded-full flex items-center gap-1.5 shadow-xs">
                                <p>ข่าวสาร/กิจกรรม</p>
                              </span>
                            ) : (
                              <span className="p-0.5 px-2 w-fit text-xs bg-red-500 text-white rounded-full flex items-center gap-1.5 shadow-xs">
                                <p>โครงการบริจาค</p>
                              </span>
                            )}
                          </div>
                          <SafeImage
                            src={n?.thumnail ? apiConfig.imgAPI + n?.thumnail : ""}
                            type="image"
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                            alt={n?.title || "news-image"}
                          />
                        </div>

                        {/* Content */}
                        <div className="p-3.5 flex flex-col text-sm">
                          <p className="w-full font-semibold text-gray-900 line-clamp-1">
                            {n?.title}
                          </p>
                          <p className="text-gray-600 w-full line-clamp-2 mt-1 mb-2.5 text-xs leading-relaxed">
                            {n?.short_detail}
                          </p>
                          {n?.category == 1 &&
                            (!n?.donate_end ||
                            n?.donate_end === "undefined" ||
                            n?.donate_end === "null" ||
                            n?.donate_end === "" ? (
                              <div className="mt-1 mb-2">
                                <span className="p-1 px-2.5 w-fit text-xs bg-gray-100 text-gray-600 rounded-full font-medium inline-block">
                                  ไม่รับเงินบริจาค
                                </span>
                              </div>
                            ) : (
                              <div className="mt-1 mb-2">
                                <div className="flex justify-between text-xs mb-1.5 text-gray-600">
                                  <p>{n?.current_money?.toLocaleString() || 0} ฿</p>

                                  <p className="font-semibold text-gray-800">
                                    {n?.target_money > 0
                                      ? `${Math.round(
                                          (n.current_money / n.target_money) * 100,
                                        )}% / ${n.target_money.toLocaleString()} ฿`
                                      : "0%"}
                                  </p>
                                </div>

                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-pink-500"
                                    style={{
                                      width: `${
                                        n?.target_money > 0
                                          ? Math.min(
                                              (n.current_money / n.target_money) *
                                                100,
                                              100,
                                            )
                                          : 0
                                      }%`,
                                    }}
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5">
                                  ปิดรับบริจาค: {DateTHFormat(n?.donate_end)}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="px-3.5 pb-3.5 pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Eye size={15} />
                          <p>{n?.view?.toLocaleString() || 0}</p>
                        </span>
                        <div className="flex items-center text-gray-700">
                          <ViewDetail data={n} showText={false} />
                          <Link
                            href={`/alumni-president/alumni-news/${n?.id}/add-new-activity`}
                            className="p-2 hover:bg-linear-90 hover:text-white hover:from-blue-600 hover:to-sky-300 rounded-lg px-2.5 text-sm flex items-center gap-2"
                            title="แก้ไข"
                          >
                            <Pen size={17} />
                          </Link>
                          <button
                            onClick={() => handleDelete(n?.id)}
                            disabled={loading || deleting}
                            className="p-2 hover:bg-red-500 text-red-500 hover:text-white rounded-lg px-2.5 text-sm flex items-center gap-2"
                            title="ลบข้อมูล"
                          >
                            {deleting ? (
                              <>
                                <Loader2 size={17} className="animate-spin" />
                              </>
                            ) : (
                              <>
                                <Trash2 size={17} />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Page;
