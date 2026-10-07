"use client";

import { useState } from "react";
import FadeInSection from "@/components/fade-in-section";
import { apiConfig } from "@/config/api.config";
import useGetSession from "@/hook/useGetSeesion";
import {
  Calendar,
  CalendarCheck,
  Edit,
  Eye,
  HandCoins,
  Newspaper,
  Trash,
  ArrowRight,
} from "lucide-react";
import dayjs from "@/libs/dayjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { alerts } from "@/libs/alerts";
import { FaHeart } from "react-icons/fa";

const NewsAvtivity = ({ item, fetchData }) => {
  const { user } = useGetSession();
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  const updateView = async (id) => {
    try {
      axios.put(
        apiConfig.rmuAPI + `/president/update-news-view/${id}`,
        {},
        { withCredentials: true }
      );
      router.push(`/users/news/${id}`);
    } catch (err) {
      console.error(err);
      router.push(`/users/news/${id}`);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const { isConfirmed } = await alerts.confirmDialog(
      "ต้องการลบข้อมูลนี้หรือไม่?",
      "ลบแล้วจะไม่สามารถกู้คืนได้",
      "ลบ"
    );
    if (!isConfirmed) return;
    try {
      const res = await axios.delete(
        apiConfig.rmuAPI + `/president/delete-news/${id}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        alerts.success("ลบข้อมูลแล้ว");
        if (fetchData) fetchData();
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    }
  };

  const isDonation = item?.category == 1;
  const targetMoney = Number(item?.target_money) || 0;
  const currentMoney = Number(item?.current_money) || 0;
  const percent = targetMoney > 0 ? Math.min(100, Math.round((currentMoney / targetMoney) * 100)) : 0;

  return (
    <FadeInSection className="w-full h-full flex flex-col">
      <div
        onClick={() => updateView(item?.id)}
        className="w-full h-full flex flex-col bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
      >
        {/* Thumbnail Image Container */}
        <div className="w-full h-44 sm:h-48 relative overflow-hidden bg-slate-100 shrink-0">
          {!imgError && item?.thumnail ? (
            <img
              alt={item?.title || "news thumbnail"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              src={apiConfig.imgAPI + item?.thumnail}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 gap-1.5 p-4 text-center">
              {isDonation ? (
                <HandCoins size={36} className="text-amber-400/80" />
              ) : (
                <Newspaper size={36} className="text-blue-400/80" />
              )}
              <span className="text-xs font-medium text-slate-500 line-clamp-1">
                มหาวิทยาลัยราชภัฏมหาสารคาม
              </span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-2.5 right-2.5 z-10">
            {isDonation ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/95 text-white shadow-sm backdrop-blur-xs">
                <HandCoins size={13} />
                <span>ร่วมบริจาค</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600/95 text-white shadow-sm backdrop-blur-xs">
                <Newspaper size={13} />
                <span>ข่าวสาร</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col p-4 sm:p-4.5 gap-2.5">
          {/* Metadata Row: Date & Views */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-400 shrink-0" />
              <span>{dayjs(item?.createdAt).format("D MMM BBBB")}</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} className="text-slate-400 shrink-0" />
              <span>{(Number(item?.view) || 0).toLocaleString()}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
            {item?.title || "ไม่มีหัวข้อ"}
          </h3>

          {/* Short Detail */}
          {item?.short_detail && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {item?.short_detail}
            </p>
          )}

          {/* Donation Progress (if donation with target) */}
          {isDonation && targetMoney > 0 && (
            <div className="mt-1 w-full flex flex-col gap-1.5 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">ยอดบริจาค</span>
                <span className="font-bold text-emerald-600">{percent}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">
                  {currentMoney.toLocaleString()} บาท
                </span>
                <span>เป้าหมาย {targetMoney.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Donation without target */}
          {isDonation && targetMoney <= 0 && (
            <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 w-fit">
              <FaHeart className="text-emerald-500 text-[10px]" />
              <span>โครงการนี้ไม่กำหนดยอดบริจาค</span>
            </div>
          )}

          {/* End Date (if donation) */}
          {isDonation && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-auto pt-1">
              <CalendarCheck size={13} className="text-slate-400" />
              <span>
                {item?.donate_end
                  ? `สิ้นสุด ${dayjs(new Date(item?.donate_end)).format("D MMM YYYY")}`
                  : "ไม่มีกำหนดวันสิ้นสุด"}
              </span>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-auto pt-2 border-t border-slate-100">
            {user && Number(user?.roleId) > 4 ? (
              <div className="flex items-center justify-between gap-2 pt-1">
                <span
                  className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${
                    item?.isPublish
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item?.isPublish ? "เผยแพร่" : "ฉบับร่าง"}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/alumni-president/alumni-news/${item?.id}/add-new-activity`
                      );
                    }}
                    className="p-1.5 px-2 text-xs rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1"
                  >
                    <Edit size={13} />
                    <span>แก้ไข</span>
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, item?.id)}
                    className="p-1.5 px-2 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1"
                  >
                    <Trash size={13} />
                    <span>ลบ</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700 pt-1">
                <span>{isDonation ? "ดูรายละเอียดบริจาค" : "อ่านรายละเอียด"}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default NewsAvtivity;
