"use client";

import Loading from "@/components/loading";
import { NewsDetailSkeleton } from "@/components/skeletons";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  CalendarCheck,
  Eye,
  Heart,
  Megaphone,
  Share2,
  HandCoins,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "@/libs/dayjs";
import { sanitizeHtml } from "@/libs/sanitize";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [imgError, setImgError] = useState(false);

  const fetchNews = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + `/president/get-news/${id}`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!params?.id) return;
    fetchNews(params.id);
  }, [params]);

  useEffect(() => {
    if (data?.category !== undefined && params?.id) {
      fetchOtherNews(data.category, params.id);
    }
  }, [data, params]);

  const fetchOtherNews = async (category, thisNewsId) => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI +
          `/president/get-other-news/${category}/${thisNewsId}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setOtherNews(res.data || []);
      }
    } catch (error) {
      console.error("fetchOtherNews error:", error);
    }
  };

  if (loading) {
    return <NewsDetailSkeleton />;
  }

  const isDonation = data?.category == 1;
  const targetMoney = Number(data?.target_money) || 0;
  const currentMoney = Number(data?.current_money) || 0;
  const percent = targetMoney > 0 ? Math.min(100, Math.round((currentMoney / targetMoney) * 100)) : 0;

  const daysLeft = data?.donate_end
    ? Math.ceil((new Date(data?.donate_end) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="w-full flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto font-sans bg-slate-50/50 min-h-screen">
      {/* Top Banner Image Header */}
      <div className="w-full h-[260px] sm:h-[340px] md:h-[400px] lg:h-[440px] relative overflow-hidden rounded-2xl shadow-md bg-slate-900 shrink-0">
        {/* Back Button */}
        <Link
          href="/users/news"
          className="z-20 text-white bg-black/45 hover:bg-black/65 backdrop-blur-md px-3.5 py-1.5 rounded-full absolute top-4 left-4 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-medium shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>ย้อนกลับ</span>
        </Link>

        {/* Banner Image or Gradient Fallback */}
        {!imgError && data?.thumnail ? (
          <img
            src={apiConfig.imgAPI + data?.thumnail}
            alt={data?.title || "Banner"}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-800 via-indigo-900 to-slate-900 flex items-center justify-center" />
        )}

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-black/25 pointer-events-none" />

        {/* Title and Metadata inside Banner */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 md:p-10 flex flex-col gap-2.5 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-fit py-1 px-3 rounded-full text-xs font-semibold shadow-xs flex items-center gap-1.5 bg-white/95 text-slate-800 backdrop-blur-xs">
              {isDonation ? (
                <>
                  <HandCoins size={13} className="text-amber-500" />
                  <span>โครงการบริจาค</span>
                </>
              ) : (
                <>
                  <Megaphone size={13} className="text-blue-600" />
                  <span>ข่าวสาร/กิจกรรม</span>
                </>
              )}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/90 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
              <Calendar size={13} />
              <span>{dayjs(data?.createdAt).format("D MMMM BBBB")}</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/90 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
              <Eye size={13} />
              <span>{(Number(data?.view) || 0).toLocaleString()} ครั้ง</span>
            </span>
          </div>

          <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white leading-tight max-w-4xl drop-shadow-sm">
            {data?.title || "ไม่มีหัวข้อ"}
          </h1>
        </div>
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Full Content */}
        <div className="flex flex-col gap-5 lg:col-span-2 bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          {/* Lead Summary Box */}
          {data?.short_detail && (
            <div className="bg-blue-50/70 border-l-4 border-blue-600 p-4 sm:p-5 rounded-r-xl text-slate-700 text-sm sm:text-base leading-relaxed">
              <p className="font-medium text-blue-900/80 mb-1 text-xs uppercase tracking-wider">
                บทคัดย่อ / สรุปสาระสำคัญ
              </p>
              {data?.short_detail}
            </div>
          )}

          {/* Sanitized HTML Detail Body */}
          <div
            className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed break-words overflow-hidden"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(data?.detail) }}
          />
        </div>

        {/* Right Column: Sidebar (Donation Status & Other News) */}
        <div className="flex flex-col gap-6">
          {/* Donation Status Card (If Donation) */}
          {isDonation && (
            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <HandCoins size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">สถานะการบริจาค</h3>
                    <p className="text-xs text-slate-500">โครงการระดมทุนมหาวิทยาลัย</p>
                  </div>
                </div>
              </div>

              {targetMoney > 0 ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">ความคืบหน้า</span>
                    <span className="font-bold text-emerald-600 text-sm">{percent}%</span>
                  </div>

                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex flex-col gap-1 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500">ยอดบริจาคปัจจุบัน:</span>
                      <span className="text-lg font-bold text-blue-600">
                        {currentMoney.toLocaleString()} <span className="text-xs font-normal text-slate-500">บาท</span>
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs text-slate-500">
                      <span>เป้าหมายระดมทุน:</span>
                      <span className="font-semibold text-slate-700">
                        {targetMoney.toLocaleString()} บาท
                      </span>
                    </div>
                  </div>

                  {daysLeft !== null && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs">
                      <div className="flex items-center gap-1.5 text-amber-800">
                        <Clock size={15} className="text-amber-600 shrink-0" />
                        <span>ระยะเวลาคงเหลือ</span>
                      </div>
                      <span className="font-bold text-amber-700 text-sm">
                        {daysLeft > 0 ? `เหลืออีก ${daysLeft} วัน` : "สิ้นสุดโครงการแล้ว"}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Heart size={14} className="text-emerald-600" />
                    <span>โครงการเปิดรับบริจาคทั่วไป</span>
                  </div>
                  <p className="text-emerald-700/90">
                    โครงการนี้ไม่กำหนดยอดเป้าหมาย สามารถร่วมบริจาคได้ตามจิตศรัทธา
                  </p>
                  <p className="font-bold text-base text-blue-700 mt-2">
                    ยอดบริจาคปัจจุบัน: {currentMoney.toLocaleString()} บาท
                  </p>
                </div>
              )}

              {data?.donate_end && (
                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <CalendarCheck size={14} className="text-slate-400" />
                  <span>
                    สิ้นสุดวันที่ {dayjs(new Date(data?.donate_end)).format("D MMMM YYYY")}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Other News / Activities Card */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col gap-4">
            <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>{isDonation ? "โครงการรับบริจาคอื่นๆ" : "ข่าวสารและกิจกรรมอื่นๆ"}</span>
            </h3>

            {otherNews.length > 0 ? (
              <div className="flex flex-col divide-y divide-slate-100">
                {otherNews.map((o, index) => (
                  <div
                    key={o?.id || index}
                    onClick={() => router.push(`/users/news/${o?.id}`)}
                    className="py-3 first:pt-0 last:pb-0 flex flex-col gap-1.5 hover:text-blue-600 cursor-pointer group transition-colors"
                  >
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-blue-600 line-clamp-2 leading-snug">
                      {o?.title}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{dayjs(o?.createdAt).format("D MMM BBBB")}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        <span>{(Number(o?.view) || 0).toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">
                ยังไม่มีข้อมูลรายการอื่นๆ ในขณะนี้
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
