"use client";
import DropdownMenu from "@/components/dropdown";
import PaginationBtn from "@/components/pageination-btn";
import SearchBox from "@/components/search-box";
import ToggleAccoutStatus from "@/components/toggle-account-status";
import { forwardPage, prevPage } from "@/libs/pagination-helper";
import {
  ChevronsUpDown,
  Filter,
  List,
  RotateCcw,
  UserPlus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CreateEdit from "./create-edit";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { debounce } from "lodash";
import RowLoader from "@/components/row-loader";
import RowDataNotFound from "@/components/row-data-notfound";
import { formatPhoneNumber } from "@/libs/validate";
import { DateTHFormat } from "@/libs/thai-local-formate-date";
import DeleteBtn from "./delete-btn";
import ExportAdminBtn from "./export-btn";
import useGetSession from "@/hook/useGetSeesion";
import Link from "next/link";

const displayTextAccountStatusSearch = (search) => {
  if (!search || search === "ทุกสถานะ") return "ทุกสถานะ";
  const normalize = JSON.parse(search).canUse;
  if (normalize) {
    return "ใช้งานได้";
  } else {
    return "ถูกระงับ";
  }
};

const AdminManage = () => {
  const { user } = useGetSession();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [take, setTake] = useState(10);
  const [sort, setSort] = useState("1");

  const resetSearch = () => {
    setPage(1);
    setSearch("");
    setFilter(null);
    setTotal(0);
    setTotalPage(1);
  };

  const [adminList, setAdminList] = useState([]);
  const [load, setLoad] = useState(true);
  const getAdminList = async (page, search, take, filter, sort) => {
    setLoad(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + `/president/get-admin-list`,
        {
          withCredentials: true,
          params: {
            page,
            search,
            take,
            filter,
            sort,
          },
        },
      );
      if (res.status === 200) {
        setAdminList(res.data?.data || []);
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

  const debounceSearch = useMemo(
    () => debounce(getAdminList, 600),
    [getAdminList],
  );
  useEffect(() => {
    debounceSearch(page, search, take, filter, sort);
  }, [page, search, take, filter, sort]);
  return (
    <div className="w-full flex flex-col p-3 sm:p-5 bg-gray-50">
      <p className="text-lg sm:text-xl font-bold text-gray-800">จัดการผู้ดูแล</p>
      <p className="text-xs sm:text-sm text-gray-600">เพิ่ม แก้ไข และลบผู้ดูแลทั้งหมดในระบบ</p>

      <div className="mt-4 sm:mt-5 w-full p-3 sm:p-5 bg-white rounded-xl border border-gray-200 shadow-2xs flex flex-col">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-base sm:text-lg font-semibold text-gray-800">รายชื่อผู้ดูแล ({total} คน)</p>
          <div className="flex items-center gap-2 flex-wrap">
            <CreateEdit
              admin={null}
              fetch={() => {
                getAdminList(page, search, take, filter, sort);
              }}
            />
            <ExportAdminBtn />
          </div>
        </div>

        <div className="mt-3 w-full flex flex-wrap gap-2 sm:gap-2.5 items-center">
          <div className="w-full lg:w-1/3">
            <SearchBox
              page={page}
              search={search}
              setPage={setPage}
              setSearch={setSearch}
            />
          </div>
          <div title="เรียงตาม" className="relative inline-block">
            <select
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              value={filter}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            >
              <option value={null} className="text-sm">
                ทุกสถานะ
              </option>
              <option
                value={JSON.stringify({ canUse: true })}
                className="text-sm"
              >
                ใช้งานได้
              </option>
              <option
                value={JSON.stringify({ canUse: false })}
                className="text-sm"
              >
                ถูกระงับ
              </option>
            </select>

            <label
              htmlFor="select-row"
              className="p-2 px-3 rounded-lg border bg-white border-gray-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 text-gray-700"
            >
              <Filter size={16} />
              <p className="text-xs sm:text-sm">
                {displayTextAccountStatusSearch(filter)}
              </p>
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
              className="p-2 px-3 rounded-lg border bg-white border-gray-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 text-gray-700"
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
                เพิ่มล่าสุด
              </option>
              <option
                value={JSON.stringify({ updatedAt: "desc" })}
                className="text-sm"
              >
                แก้ไขล่าสุด
              </option>
            </select>
            <label
              htmlFor="select-row"
              className="p-2 px-3 rounded-lg border bg-white border-gray-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 text-gray-700"
            >
              <ChevronsUpDown size={16} />
              <p className="text-xs sm:text-sm">เรียง</p>
            </label>
          </div>
          <button
            onClick={resetSearch}
            className="p-2 px-3 rounded-lg flex items-center text-xs sm:text-sm border border-gray-300 bg-white hover:bg-gray-50 shadow-xs gap-1.5 text-gray-700"
          >
            <RotateCcw size={16} />
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

        <div className="mt-3.5 w-full h-[600px] overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-[700px] w-full">
            <thead>
              <tr className="shadow-sm bg-blue-50 rounded-tr-lg border-b border-gray-300 sticky top-0 left-0">
                <th className="p-2.5 pb-3 text-sm font-normal text-start">
                  ผู้ดูแล
                </th>
                <th className="p-2.5 pb-3 text-sm font-normal text-start">
                  อีเมล
                </th>

                <th className="p-2.5 pb-3 text-sm font-normal text-start">
                  วันที่เพิ่ม
                </th>
                <th className="p-2.5 pb-3 text-sm font-normal text-start">
                  เข้าสู่ระบบล่าสุด
                </th>
                <th className="p-2.5 pb-3 text-sm font-normal text-start">
                  สถานะบัญชี
                </th>
                <th className="p-2.5 pb-3 text-sm font-normal text-start">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {load ? (
                <RowLoader numcol={6} />
              ) : adminList.length < 1 ? (
                <RowDataNotFound numCol={6} />
              ) : (
                adminList.map((a, index) => {
                  const isCurrentUser = a?.admin_id === user?.id;
                  return (
                    <tr
                      key={index}
                      className={`text-sm transition-all ${
                        isCurrentUser
                          ? "bg-blue-50/60 hover:bg-blue-50/80"
                          : "hover:bg-blue-50/30"
                      }`}
                    >
                      <td className="p-2.5 pb-3 border-b border-gray-300">
                        <div className="flex flex-col text-sm">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-medium text-gray-800">
                              {a?.prefix || ""}
                              {a?.fname || ""} {a?.lname || ""}
                            </p>
                            {isCurrentUser && (
                              <span className="text-[11px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                                คุณ
                              </span>
                            )}
                          </div>
                          <p className="text-blue-500">
                            {formatPhoneNumber(a?.tel)}
                          </p>
                        </div>
                      </td>
                      <td className="p-2.5 pb-3 border-b border-gray-300">
                        <p>{a?.email || "ไม่พบอีเมล"}</p>
                      </td>
                      <td className="p-2.5 pb-3 border-b border-gray-300">
                        <p>{DateTHFormat(a?.createdAt)}</p>
                      </td>
                      <td className="p-2.5 pb-3 border-b border-gray-300">
                        <p>
                          {a?.lastestLogin
                            ? DateTHFormat(a?.lastestLogin)
                            : "ไม่พบการเข้าสู่ระบบ"}
                        </p>
                      </td>
                      <td className="p-2.5 pb-3 border-b border-gray-300">
                        {isCurrentUser ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            กำลังใช้งาน (คุณ)
                          </span>
                        ) : (
                          <ToggleAccoutStatus
                            role={5}
                            canUse={a?.canUse}
                            fetchData={() => {
                              getAdminList(page, search, take, filter, sort);
                            }}
                            user_id={a?.admin_id}
                          />
                        )}
                      </td>
                      <td className="p-2.5 pb-3 border-b border-gray-300">
                        {isCurrentUser ? (
                          <Link
                            href="/alumni-president/account"
                            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                            title="ไปที่เมนูบัญชีเพื่อจัดการข้อมูลของตนเอง"
                          >
                            จัดการที่เมนูบัญชี
                          </Link>
                        ) : (
                          <DropdownMenu>
                            <CreateEdit
                              admin={a}
                              fetch={() =>
                                getAdminList(page, search, take, filter, sort)
                              }
                            />
                            <DeleteBtn
                              admin={a}
                              fetch={() =>
                                getAdminList(page, search, take, filter, sort)
                              }
                            />
                          </DropdownMenu>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminManage;
