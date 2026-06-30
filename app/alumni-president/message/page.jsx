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
      <div className="w-full flex flex-col p-5 bg-gray-50">
        <p className="text-xl font-bold">ประวัติการส่งข้อความ</p>
        <p className="text-sm text-gray-700">
          ตรวจสอบและจัดการประวัติการส่งอีเมลทั้งหมด
        </p>

        <div className="mt-3.5 w-full grid lg:grid-cols-5 gap-3.5 md:grid-cols-2">
          <FadeInSection
            className={
              "p-3.5 rounded-lg bg-white border border-gray-300 shadow-sm flex items-center gap-3.5"
            }
          >
            <p className="p-2 rounded-lg bg-blue-50 text-blue-500">
              <Mail />
            </p>
            <span className="flex flex-col gap-0.5">
              <p className="text-sm text-gray-700">ประวัติการส่งทั้งหมด</p>
              {loadStats ? (
                <Loader2 className="animate-spin text-blue-500 mt-1" />
              ) : (
                <p className="text-xl font-bold">
                  {stats?.all?.toLocaleString() || 0}
                </p>
              )}
            </span>
          </FadeInSection>
          <FadeInSection
            className={
              "p-3.5 rounded-lg bg-white border border-gray-300 shadow-sm flex items-center gap-3.5"
            }
          >
            <p className="p-2 rounded-lg bg-orange-50 text-orange-500">
              <UserCog />
            </p>
            <span className="flex flex-col gap-0.5">
              <p className="text-sm text-gray-700">ส่งโดยผู้ดูแล</p>
              {loadStats ? (
                <Loader2 className="animate-spin text-blue-500 mt-1" />
              ) : (
                <p className="text-xl font-bold">
                  {stats?.allAdmin?.toLocaleString() || 0}
                </p>
              )}
            </span>
          </FadeInSection>
          <FadeInSection
            className={
              "p-3.5 rounded-lg bg-white border border-gray-300 shadow-sm flex items-center gap-3.5"
            }
          >
            <p className="p-2 rounded-lg bg-amber-50 text-yellow-500">
              <User />
            </p>
            <span className="flex flex-col gap-0.5">
              <p className="text-sm text-gray-700">ส่งโดยผู้บริหาร</p>
              {loadStats ? (
                <Loader2 className="animate-spin text-blue-500 mt-1" />
              ) : (
                <p className="text-xl font-bold">
                  {stats?.allEx?.toLocaleString() || 0}
                </p>
              )}
            </span>
          </FadeInSection>
          <FadeInSection
            className={
              "p-3.5 rounded-lg bg-white border border-gray-300 shadow-sm flex items-center gap-3.5"
            }
          >
            <p className="p-2 rounded-lg bg-purple-50 text-pink-500">
              <BookUser />
            </p>
            <span className="flex flex-col gap-0.5">
              <p className="text-sm text-gray-700">ส่งโดยอาจารย์</p>
              {loadStats ? (
                <Loader2 className="animate-spin text-blue-500 mt-1" />
              ) : (
                <p className="text-xl font-bold">
                  {stats?.allProfessor?.toLocaleString() || 0}
                </p>
              )}
            </span>
          </FadeInSection>
          <FadeInSection
            className={
              "p-3.5 rounded-lg bg-white border border-gray-300 shadow-sm flex items-center gap-3.5"
            }
          >
            <p className="p-2 rounded-lg bg-sky-50 text-sky-500">
              <GraduationCap />
            </p>
            <span className="flex flex-col gap-0.5">
              <p className="text-sm text-gray-700">ส่งโดยศิษย์เก่า</p>
              {loadStats ? (
                <Loader2 className="animate-spin text-blue-500 mt-1" />
              ) : (
                <p className="text-xl font-bold">
                  {stats?.allAlumni?.toLocaleString() || 0}
                </p>
              )}
            </span>
          </FadeInSection>
        </div>

        <div className="mt-5 w-full p-5 rounded-lg shadow-sm bg-white">
          <div className="w-full flex items-center justify-between">
            <p className="text-sm">
              รายการประวัติการส่งข้อความ ({total} ครั้ง)
            </p>
            <Link
              href={"/alumni-president/message/0"}
              className="flex items-center gap-2 text-sm hover:bg-blue-600 shadow-sm bg-blue-500 text-white p-2 px-3.5 rounded-lg"
            >
              <MailPlus size={18} />
              <p>ส่งข้อความ</p>
            </Link>
          </div>

          <div className="w-full mt-1.5 flex items-center flex-wrap gap-2.5">
            <button
              onClick={() => setSearchSender("all")}
              className={`flex ${searchSender === "all" ? "text-blue-500 bg-blue-100" : "bg-gray-50 text-gray-600 hover:bg-gray-100"} p-2 text-sm justify-center flex-1 items-center gap-2 rounded-lg`}
            >
              <Mail size={16} />
              <p>ทั้งหมด</p>
            </button>
            <button
              onClick={() => setSearchSender("admin")}
              className={`flex ${searchSender === "admin" ? "text-blue-500 bg-blue-100" : "bg-gray-50 text-gray-600 hover:bg-gray-100"} p-2 text-sm justify-center flex-1 items-center gap-2 rounded-lg`}
            >
              <UserCog size={16} />
              <p>ส่งโดยผู้ดูแล</p>
            </button>
            <button
              onClick={() => setSearchSender("executive")}
              className={`flex ${searchSender === "executive" ? "text-blue-500 bg-blue-100" : "bg-gray-50 text-gray-600 hover:bg-gray-100"} p-2 text-sm justify-center flex-1 items-center gap-2 rounded-lg`}
            >
              <User size={16} />
              <p>ส่งโดยผู้บริหาร</p>
            </button>
            <button
              onClick={() => setSearchSender("professor")}
              className={`flex ${searchSender === "professor" ? "text-blue-500 bg-blue-100" : "bg-gray-50 text-gray-600 hover:bg-gray-100"} p-2 text-sm justify-center flex-1 items-center gap-2 rounded-lg`}
            >
              <BookUser size={16} />
              <p>ส่งโดยอาจารย์</p>
            </button>
            <button
              onClick={() => setSearchSender("alumni")}
              className={`flex ${searchSender === "alumni" ? "text-blue-500 bg-blue-100" : "bg-gray-50 text-gray-600 hover:bg-gray-100"} p-2 text-sm justify-center flex-1 items-center gap-2 rounded-lg`}
            >
              <GraduationCap size={16} />
              <p>ส่งโดยศิษย์เก่า</p>
            </button>
          </div>
          <div className="mt-2 w-full flex items-center gap-2.5 flex-wrap">
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
            <PaginationBtn
              forwardPage={() => forwardPage(page, setPage, totalPage)}
              page={page}
              prevPage={() => prevPage(page, setPage)}
              totalPage={totalPage}
            />
          </div>
          <div className="mt-3.5 w-full h-[600px] rounded-tl-lg rounded-tr-lg overflow-auto">
            <table className="min-w-max w-full">
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
