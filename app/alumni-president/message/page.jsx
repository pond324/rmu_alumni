"use client";
import DropdownMenu from "@/components/dropdown";
import FadeInSection from "@/components/fade-in-section";
import SendMessage from "@/components/message-component";
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
  BookUser,
  ChevronsUpDown,
  GraduationCap,
  List,
  ListRestart,
  Loader2,
  Mail,
  MailPlus,
  Send,
  Trash2,
  User,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ViewDetail from "./view-detail";

export const displaySenderName = (senderType, data) => {
  let text = {};
  switch (senderType) {
    case "admin":
      text = {
        type: "ผู้ดูแล",
        name: `${data?.admin?.prefix}${data?.admin?.fname} ${data?.admin?.lname}`,
      };

      break;

    case "executive":
      text = {
        type: "ผู้บริหาร",
        name: `${data?.professor?.academic_rank || "อาจารย์"}${data?.professor?.fname} ${data?.professor?.lname}`,
      };

      break;
    case "professor":
      text = {
        type: "อาจารย์",
        name: `${data?.professor?.academic_rank || "อาจารย์"}${data?.professor?.fname} ${data?.professor?.lname}`,
      };

      break;
    default:
      text = {
        type: "ศิษย์เก่า",
        name: `${data?.alumni?.prefix}${data?.alumni?.fname} ${data?.alumni?.lname}`,
      };
      break;
  }

  return text;
};

const setProfileImage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [searchSender, setSearchSender] = useState("all");
  const [take, setTake] = useState(10);
  const [sort, setSort] = useState(JSON.stringify({ createdAt: "desc" }));
  const resetSearch = () => {
    setSearch("");
    setSearchSender(0);
    setTake(10);
    setSort(JSON.stringify({ createdAt: "desc" }));
  };

  const [stats, setStats] = useState(null);
  const [loadStats, setLoadStats] = useState(true);
  const getStats = async () => {
    setLoadStats(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + `/president/get-sendtext-stats`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        setStats(res.data);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoadStats(false);
    }
  };
  useEffect(() => {
    getStats();
  }, []);

  const [load, setLoad] = useState(true);
  const [sendTextList, setSendTextList] = useState([]);
  const getHistory = async (search, page, take, sort, searchSender) => {
    setLoad(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-sendtext-list",
        {
          withCredentials: true,
          params: {
            search,
            page,
            take,
            sort,
            searchSender,
          },
        },
      );
      if (res.status === 200) {
        setSendTextList(res?.data?.data || []);
        // console.log("🚀 ~ getHistory ~ res?.data?.data:", res?.data?.data);
        setTotal(res?.data?.total || 0);
        setTotalPage(res?.data?.totalPage || 1);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };

  const debounceSearch = useMemo(() => debounce(getHistory, 600), [getHistory]);
  useEffect(() => {
    debounceSearch(search, page, take, sort, searchSender);
  }, [search, page, take, sort, searchSender]);

  const [deleting, setDeleting] = useState(false);
  const handleDelete = async (id) => {
    const { isConfirmed } = await alerts.confirmDialog(
      "ยืนยันลบประวัติการส่งข้อความ",
      "คุณต้องการลบประวัติการส่งข้อความนี้?",
    );
    if (!isConfirmed) return;
    setDeleting(true);
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI + `/president/delete-sendtext/${id}`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        alerts.success("ลบประวัติแล้ว!");
        getHistory(search, page, take, sort, searchSender);
        getStats();
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
      <div className="w-full flex flex-col p-3 sm:p-5 bg-gray-50">
        <p className="text-lg sm:text-xl font-bold text-gray-800">ประวัติการส่งข้อความ</p>
        <p className="text-xs sm:text-sm text-gray-600">
          ตรวจสอบและจัดการประวัติการส่งอีเมลทั้งหมด
        </p>

        <div className="mt-4 sm:mt-5 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          <FadeInSection
            className={
              "p-3 sm:p-3.5 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center gap-3 sm:gap-3.5"
            }
          >
            <p className="p-2 rounded-lg bg-blue-50 text-blue-500 shrink-0">
              <Mail size={18} />
            </p>
            <span className="flex flex-col gap-0.5">
              <p className="text-xs sm:text-sm text-gray-600">ทั้งหมด</p>
              {loadStats ? (
                <Loader2 className="animate-spin text-blue-500 mt-1" />
              ) : (
                <p className="text-lg sm:text-xl font-bold text-gray-800">
                  {stats?.all?.toLocaleString() || 0}
                </p>
              )}
            </span>
          </FadeInSection>
          <FadeInSection
            className={
              "p-3 sm:p-3.5 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center gap-3 sm:gap-3.5"
            }
          >
            <p className="p-2 rounded-lg bg-orange-50 text-orange-500 shrink-0">
              <UserCog size={18} />
            </p>
            <span className="flex flex-col gap-0.5">
              <p className="text-xs sm:text-sm text-gray-600">โดยผู้ดูแล</p>
              {loadStats ? (
                <Loader2 className="animate-spin text-blue-500 mt-1" />
              ) : (
                <p className="text-lg sm:text-xl font-bold text-gray-800">
                  {stats?.allAdmin?.toLocaleString() || 0}
                </p>
              )}
            </span>
          </FadeInSection>
          <FadeInSection
            className={
              "p-3 sm:p-3.5 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center gap-3 sm:gap-3.5"
            }
          >
            <p className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
              <User size={18} />
            </p>
            <span className="flex flex-col gap-0.5">
              <p className="text-xs sm:text-sm text-gray-600">โดยผู้บริหาร</p>
              {loadStats ? (
                <Loader2 className="animate-spin text-blue-500 mt-1" />
              ) : (
                <p className="text-lg sm:text-xl font-bold text-gray-800">
                  {stats?.allEx?.toLocaleString() || 0}
                </p>
              )}
            </span>
          </FadeInSection>
          <FadeInSection
            className={
              "p-3 sm:p-3.5 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center gap-3 sm:gap-3.5"
            }
          >
            <p className="p-2 rounded-lg bg-purple-50 text-purple-600 shrink-0">
              <BookUser size={18} />
            </p>
            <span className="flex flex-col gap-0.5">
              <p className="text-xs sm:text-sm text-gray-600">โดยอาจารย์</p>
              {loadStats ? (
                <Loader2 className="animate-spin text-blue-500 mt-1" />
              ) : (
                <p className="text-lg sm:text-xl font-bold text-gray-800">
                  {stats?.allProfessor?.toLocaleString() || 0}
                </p>
              )}
            </span>
          </FadeInSection>
          <FadeInSection
            className={
              "p-3 sm:p-3.5 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center gap-3 sm:gap-3.5 col-span-2 sm:col-span-1"
            }
          >
            <p className="p-2 rounded-lg bg-sky-50 text-sky-600 shrink-0">
              <GraduationCap size={18} />
            </p>
            <span className="flex flex-col gap-0.5">
              <p className="text-xs sm:text-sm text-gray-600">โดยศิษย์เก่า</p>
              {loadStats ? (
                <Loader2 className="animate-spin text-blue-500 mt-1" />
              ) : (
                <p className="text-lg sm:text-xl font-bold text-gray-800">
                  {stats?.allAlumni?.toLocaleString() || 0}
                </p>
              )}
            </span>
          </FadeInSection>
        </div>

        <div className="mt-4 sm:mt-5 w-full p-3 sm:p-5 rounded-xl shadow-2xs border border-gray-200 bg-white">
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs sm:text-sm font-semibold text-gray-800">
              รายการประวัติการส่งข้อความ ({total} ครั้ง)
            </p>
            <Link
              href={"/alumni-president/message/0"}
              className="flex items-center gap-2 text-xs sm:text-sm hover:bg-blue-700 shadow-xs bg-blue-600 text-white p-2 px-3.5 rounded-lg w-fit transition"
            >
              <MailPlus size={16} />
              <p>ส่งข้อความ</p>
            </Link>
          </div>

          <div className="w-full mt-2 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
            <button
              onClick={() => setSearchSender("all")}
              className={`flex ${searchSender === "all" ? "text-blue-600 bg-blue-100 font-medium" : "bg-gray-50 text-gray-600 hover:bg-gray-100"} p-2 text-xs sm:text-sm justify-center flex-1 items-center gap-1.5 sm:gap-2 rounded-lg transition`}
            >
              <Mail size={16} />
              <p>ทั้งหมด</p>
            </button>
            <button
              onClick={() => setSearchSender("admin")}
              className={`flex ${searchSender === "admin" ? "text-blue-600 bg-blue-100 font-medium" : "bg-gray-50 text-gray-600 hover:bg-gray-100"} p-2 text-xs sm:text-sm justify-center flex-1 items-center gap-1.5 sm:gap-2 rounded-lg transition`}
            >
              <UserCog size={16} />
              <p>ส่งโดยผู้ดูแล</p>
            </button>
            <button
              onClick={() => setSearchSender("executive")}
              className={`flex ${searchSender === "executive" ? "text-blue-600 bg-blue-100 font-medium" : "bg-gray-50 text-gray-600 hover:bg-gray-100"} p-2 text-xs sm:text-sm justify-center flex-1 items-center gap-1.5 sm:gap-2 rounded-lg transition`}
            >
              <User size={16} />
              <p>ส่งโดยผู้บริหาร</p>
            </button>
            <button
              onClick={() => setSearchSender("professor")}
              className={`flex ${searchSender === "professor" ? "text-blue-600 bg-blue-100 font-medium" : "bg-gray-50 text-gray-600 hover:bg-gray-100"} p-2 text-xs sm:text-sm justify-center flex-1 items-center gap-1.5 sm:gap-2 rounded-lg transition`}
            >
              <BookUser size={16} />
              <p>ส่งโดยอาจารย์</p>
            </button>
            <button
              onClick={() => setSearchSender("alumni")}
              className={`flex ${searchSender === "alumni" ? "text-blue-600 bg-blue-100 font-medium" : "bg-gray-50 text-gray-600 hover:bg-gray-100"} p-2 text-xs sm:text-sm justify-center flex-1 items-center gap-1.5 sm:gap-2 rounded-lg transition col-span-2 sm:col-span-1`}
            >
              <GraduationCap size={16} />
              <p>ส่งโดยศิษย์เก่า</p>
            </button>
          </div>
          <div className="mt-3 w-full flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <SearchBox
                page={page}
                search={search}
                setPage={setPage}
                setSearch={setSearch}
              />
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
                htmlFor="select-row"
                className="p-2 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 shadow-xs flex items-center justify-center gap-2 cursor-pointer text-gray-700"
              >
                <List size={16} />
                <p className="text-xs sm:text-sm">แสดง {take} แถว</p>
              </label>
            </div>
            <div title="เรียงตาม" className="relative inline-block">
              <select
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                value={sort}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              >
                <option
                  value={JSON.stringify({ createdAt: "desc" })}
                  className="text-sm"
                >
                  ล่าสุด
                </option>
                <option
                  value={JSON.stringify({ createdAt: "asc" })}
                  className="text-sm"
                >
                  เก่าที่สุด
                </option>
              </select>
              <label
                htmlFor="select-row"
                className="p-2 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 shadow-xs flex items-center justify-center gap-2 cursor-pointer text-gray-700"
              >
                <ChevronsUpDown size={16} />
                <p className="text-xs sm:text-sm">เรียง</p>
              </label>
            </div>
            <button
              type="button"
              onClick={resetSearch}
              className="p-2 px-3 rounded-lg text-xs sm:text-sm bg-white hover:bg-gray-50 border border-gray-300 shadow-xs flex items-center gap-1.5 text-gray-700"
            >
              <ListRestart size={16} />
              <p>ล้างการค้นหา</p>
            </button>
            <div className="sm:ml-auto flex items-center">
              <PaginationBtn
                forwardPage={() => forwardPage(page, setPage, totalPage)}
                page={page}
                prevPage={() => prevPage(page, setPage)}
                totalPage={totalPage}
              />
            </div>
          </div>
          <div className="mt-3.5 w-full h-[600px] rounded-xl border border-gray-200 overflow-auto">
            <table className="min-w-[700px] w-full">
              <thead>
                <tr className="border-b border-gray-300 bg-blue-50 shadow-sm sticky top-0 left-0 z-20">
                  <th className="text-sm p-2.5 font-normal text-start pb-3">
                    หัวข้อ
                  </th>
                  <th className="text-sm p-2.5 font-normal text-start pb-3">
                    ผู้ส่ง
                  </th>
                  <th className="text-sm p-2.5 font-normal text-start pb-3">
                    ผู้รับ
                  </th>
                  <th className="text-sm p-2.5 font-normal text-start pb-3">
                    วันที่
                  </th>
                  <th className="text-sm p-2.5 font-normal text-start pb-3">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {load ? (
                  <RowLoader numcol={5} />
                ) : sendTextList.length < 1 ? (
                  <RowDataNotFound numCol={5} />
                ) : (
                  sendTextList.map((s, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-300 cursor-pointer transition-all hover:bg-gray-50"
                    >
                      <td className="p-2.5 pb-3">
                        <div className="flex flex-col ">
                          <p className="font-semibold">{s?.title}</p>
                          <p className="text-sm line-clamp-1 text-gray-700 w-150">
                            {s?.detail?.replace(/<[^>]*>/g, "")}
                          </p>
                          <div className="w-full flex flex-wrap items-center gap-2">
                            {s?.category?.split(",").map((c, index) => (
                              <p
                                key={index}
                                className="p-0.5 mt-1.5 w-fit px-2.5 text-xs rounded-full bg-blue-50 border border-blue-300 text-blue-500 font-semibold"
                              >
                                {c}
                              </p>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="p-2.5 pb-3 text-sm">
                        <div className="flex flex-col gap-1">
                          <p className="">
                            {displaySenderName(s?.sender_type, s).name}
                          </p>
                          <p className="p-0.5 w-fit px-2.5 text-xs rounded-full bg-blue-500 text-white border border-blue-300 font-semibold">
                            {displaySenderName(s?.sender_type, s).type}
                          </p>
                        </div>
                      </td>
                      <td className="p-2.5 pb-3 text-sm">
                        <span className="flex items-center text-sm gap-2 bg-gray-50 shadow-sm rounded-full w-fit p-1 px-2.5">
                          <GraduationCap size={18} className="text-gray-700" />
                          <p className="">
                            {s?.alumniId?.split(",").length?.toLocaleString() ||
                              0}
                          </p>
                          <p className="tetx-gray-700">คน</p>
                        </span>
                      </td>
                      <td className="p-2.5 pb-3 text-sm">
                        <p>{DateTHFormat(s?.createdAt)}</p>
                      </td>
                      <td className="p-2.5 pb-3 text-sm">
                        <DropdownMenu>
                          <ViewDetail sendText={s} />
                          <Link
                            href={`/alumni-president/message/${s?.id}`}
                            className="p-2 hover:text-white hover:bg-linear-90 hover:from-blue-600 hover:to-sky-300 px-3 rounded-lg flex items-center gap-2 text-sm"
                          >
                            <Send size={18} />
                            <p>ส่งซ้ำ</p>
                          </Link>
                          <button
                            disabled={deleting}
                            onClick={() => handleDelete(s?.id)}
                            className="p-2 text-red-500 hover:text-white hover:bg-red-500 px-3 rounded-lg flex items-center gap-2 text-sm"
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
                                <p>ลบประวัติ</p>
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
        </div>
      </div>
    </>
  );
};
export default setProfileImage;
