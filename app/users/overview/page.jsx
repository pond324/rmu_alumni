"use client";
import FadeInSection from "@/components/fade-in-section";
import { apiConfig } from "@/config/api.config";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import {
  ChartBar,
  Clock,
  Database,
  Eye,
  GraduationCap,
  HeartHandshake,
  Loader2,
  Newspaper,
  Send,
  UserCog,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import AlumniGroupByFacBarChart from "./alumni-groupbyFac-bar-chart";
import AlumniRegisDonutChart from "./alumni-regis-dont-chart";
import AlumniGroupByWorkBarChart from "./alumni-groupby-gender";
import AlumniGroupByYear from "./alumni-groupy-year";
import ProfessorGroupByPosition from "./professor-groupby-position-pie";
import SendTextGroupbySender from "./send-text-groupby-sender";
import NewsGroupByType from "./news-groupby-type";
import UserListAndAcconutCanUse from "./user-list-and-accout-canuse";
import PopularNews from "./popular-news";
import ImportDataHistory from "./import-data-history";
import useGetSession from "@/hook/useGetSeesion";
import { useRouter } from "next/navigation";

const Overviews = () => {
  const { user, checking } = useGetSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loadStats, setLoadStats] = useState(true);
  const getStats = async () => {
    try {
      const res = await axios.get(
        apiConfig.rmuAPI + "/president/get-report-stats",
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

  useEffect(() => {
    if (checking) return;
    if (!user || !user?.roleId || Number(user?.roleId) < 4)
      return router.push("/");
  }, [user, checking]);

  return (
    <div className="w-full min-w-0 p-3.5 sm:p-5 md:p-6 bg-gray-50 flex flex-col">
      <span className="flex items-center gap-2">
        <ChartBar className="text-blue-500 shrink-0" />
        <p className="text-xl font-bold">รายงานภาพรวมระบบ</p>
      </span>
      <p className="text-gray-700 mt-0.5 text-sm sm:text-base">
        สรุปสถิติและข้อมูลทุกด้านของระบบศิษย์เก่า
      </p>

      <div className="mt-5 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {/* Card 1: ศิษย์เก่าทั้งหมด */}
        <FadeInSection className="p-4 rounded-xl bg-white border border-gray-200 border-l-4 border-l-blue-500 shadow-xs hover:shadow-md transition-all flex items-start justify-between min-w-0">
          <span className="flex flex-col min-w-0 flex-1 mr-2">
            <p className="text-xs font-semibold text-gray-500 truncate">
              ศิษย์เก่าทั้งหมด
            </p>
            {loadStats ? (
              <Loader2
                size={30}
                className="animate-spin mt-2 text-blue-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 mt-1 truncate">
                  {stats?.allAlumni?.toLocaleString() || 0}
                </p>
                <p className="text-gray-400 text-xs mt-0.5 truncate">
                  ยังไม่ลงทะเบียน {stats?.allNoRegis?.toLocaleString() || 0} คน
                </p>
              </>
            )}
          </span>
          <div className="w-10 h-10 rounded-full border border-blue-200 bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <GraduationCap size={20} />
          </div>
        </FadeInSection>

        {/* Card 2: บุคลากรทั้งหมด */}
        <FadeInSection className="p-4 rounded-xl bg-white border border-gray-200 border-l-4 border-l-indigo-500 shadow-xs hover:shadow-md transition-all flex items-start justify-between min-w-0">
          <span className="flex flex-col min-w-0 flex-1 mr-2">
            <p className="text-xs font-semibold text-gray-500 truncate">
              บุคลากรทั้งหมด
            </p>
            {loadStats ? (
              <Loader2
                size={30}
                className="animate-spin mt-2 text-indigo-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 mt-1 truncate">
                  {stats?.allProfessor?.toLocaleString() || 0}
                </p>
                <p className="text-red-500 text-xs mt-0.5 truncate">
                  ถูกระงับบัญชี{" "}
                  {stats?.allProfessorCanNotUse?.toLocaleString() || 0} คน
                </p>
              </>
            )}
          </span>
          <div className="w-10 h-10 rounded-full border border-indigo-200 bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Users size={20} />
          </div>
        </FadeInSection>

        {/* Card 3: ผู้ดูแล */}
        <FadeInSection className="p-4 rounded-xl bg-white border border-gray-200 border-l-4 border-l-sky-500 shadow-xs hover:shadow-md transition-all flex items-start justify-between min-w-0">
          <span className="flex flex-col min-w-0 flex-1 mr-2">
            <p className="text-xs font-semibold text-gray-500 truncate">
              ผู้ดูแล
            </p>
            {loadStats ? (
              <Loader2
                size={30}
                className="animate-spin mt-2 text-sky-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 mt-1 truncate">
                  {stats?.allAdmin?.toLocaleString() || 0}
                </p>
                <p className="text-gray-400 text-xs mt-0.5 truncate">
                  ถูกระงับบัญชี {stats?.allAdminCanotUse?.toLocaleString() || 0}{" "}
                  คน
                </p>
              </>
            )}
          </span>
          <div className="w-10 h-10 rounded-full border border-sky-200 bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
            <UserCog size={20} />
          </div>
        </FadeInSection>

        {/* Card 4: ศิษย์เก่ารอตรวจสอบการลงทะเบียน */}
        <FadeInSection className="p-4 rounded-xl bg-white border border-gray-200 border-l-4 border-l-amber-500 shadow-xs hover:shadow-md transition-all flex items-start justify-between min-w-0">
          <span className="flex flex-col min-w-0 flex-1 mr-2">
            <p className="text-xs font-semibold text-gray-500 truncate">
              รอตรวจสอบการลงทะเบียน
            </p>
            {loadStats ? (
              <Loader2
                size={30}
                className="animate-spin mt-2 text-amber-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 mt-1 truncate">
                  {stats?.allAlumniPending?.toLocaleString() || 0}
                </p>
                <p className="text-xs mt-0.5 text-red-500 truncate">
                  การชำระถูกปฏิเสธ{" "}
                  {stats?.allAlumniRefuse?.toLocaleString() || 0} คน
                </p>
              </>
            )}
          </span>
          <div className="w-10 h-10 rounded-full border border-amber-200 bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Clock size={20} />
          </div>
        </FadeInSection>

        {/* Card 5: ข่าวสาร/กิจกรรม/โครงการบริจาค */}
        <FadeInSection className="p-4 rounded-xl bg-white border border-gray-200 border-l-4 border-l-emerald-500 shadow-xs hover:shadow-md transition-all flex items-start justify-between min-w-0">
          <span className="flex flex-col min-w-0 flex-1 mr-2">
            <p className="text-xs font-semibold text-gray-500 truncate">
              ข่าวสาร / กิจกรรม / บริจาค
            </p>
            {loadStats ? (
              <Loader2
                size={30}
                className="animate-spin mt-2 text-emerald-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 mt-1 truncate">
                  {stats?.allNews?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  รายการทั้งหมดในระบบ
                </p>
              </>
            )}
          </span>
          <div className="w-10 h-10 rounded-full border border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Newspaper size={20} />
          </div>
        </FadeInSection>

        {/* Card 6: ยอดการเข้าชมข่าวทั้งหมด */}
        <FadeInSection className="p-4 rounded-xl bg-white border border-gray-200 border-l-4 border-l-cyan-500 shadow-xs hover:shadow-md transition-all flex items-start justify-between min-w-0">
          <span className="flex flex-col min-w-0 flex-1 mr-2">
            <p className="text-xs font-semibold text-gray-500 truncate">
              ยอดการเข้าชมข่าวทั้งหมด
            </p>
            {loadStats ? (
              <Loader2
                size={30}
                className="animate-spin mt-2 text-cyan-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 mt-1 truncate">
                  {stats?.allNewsViews?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">ครั้ง</p>
              </>
            )}
          </span>
          <div className="w-10 h-10 rounded-full border border-cyan-200 bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
            <Eye size={20} />
          </div>
        </FadeInSection>

        {/* Card 7: ยอดเงินบริจาคสะสม */}
        <FadeInSection className="p-4 rounded-xl bg-white border border-gray-200 border-l-4 border-l-rose-500 shadow-xs hover:shadow-md transition-all flex items-start justify-between min-w-0">
          <span className="flex flex-col min-w-0 flex-1 mr-2">
            <p className="text-xs font-semibold text-gray-500 truncate">
              ยอดเงินบริจาคสะสม
            </p>
            {loadStats ? (
              <Loader2
                size={30}
                className="animate-spin mt-2 text-rose-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 mt-1 truncate">
                  ฿{stats?.allCurrentMoney?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">บาท</p>
              </>
            )}
          </span>
          <div className="w-10 h-10 rounded-full border border-rose-200 bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <HeartHandshake size={20} />
          </div>
        </FadeInSection>

        {/* Card 8: ประวัติการส่งข้อความ */}
        <FadeInSection className="p-4 rounded-xl bg-white border border-gray-200 border-l-4 border-l-violet-500 shadow-xs hover:shadow-md transition-all flex items-start justify-between min-w-0">
          <span className="flex flex-col min-w-0 flex-1 mr-2">
            <p className="text-xs font-semibold text-gray-500 truncate">
              ประวัติการส่งข้อความ
            </p>
            {loadStats ? (
              <Loader2
                size={30}
                className="animate-spin mt-2 text-violet-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 mt-1 truncate">
                  {stats?.allSendText?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">ข้อความ</p>
              </>
            )}
          </span>
          <div className="w-10 h-10 rounded-full border border-violet-200 bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
            <Send size={20} />
          </div>
        </FadeInSection>

        {/* Card 9: การนำเข้าข้อมูลศิษย์เก่า */}
        <FadeInSection className="p-4 rounded-xl bg-white border border-gray-200 border-l-4 border-l-teal-500 shadow-xs hover:shadow-md transition-all flex items-start justify-between min-w-0">
          <span className="flex flex-col min-w-0 flex-1 mr-2">
            <p className="text-xs font-semibold text-gray-500 truncate">
              การนำเข้าข้อมูลศิษย์เก่า
            </p>
            {loadStats ? (
              <Loader2
                size={30}
                className="animate-spin mt-2 text-teal-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 mt-1 truncate">
                  {stats?.allImportAlumni?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">ครั้ง</p>
              </>
            )}
          </span>
          <div className="w-10 h-10 rounded-full border border-teal-200 bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
            <Database size={20} />
          </div>
        </FadeInSection>

        {/* Card 10: การนำเข้าข้อมูลบุคลากร */}
        <FadeInSection className="p-4 rounded-xl bg-white border border-gray-200 border-l-4 border-l-purple-500 shadow-xs hover:shadow-md transition-all flex items-start justify-between min-w-0">
          <span className="flex flex-col min-w-0 flex-1 mr-2">
            <p className="text-xs font-semibold text-gray-500 truncate">
              การนำเข้าข้อมูลบุคลากร
            </p>
            {loadStats ? (
              <Loader2
                size={30}
                className="animate-spin mt-2 text-purple-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-900 mt-1 truncate">
                  {stats?.allImportPersonel?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">ครั้ง</p>
              </>
            )}
          </span>
          <div className="w-10 h-10 rounded-full border border-purple-200 bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Database size={20} />
          </div>
        </FadeInSection>
      </div>

      <div
        id="#alumni"
        className="mt-5 w-full flex flex-col lg:flex-row items-stretch gap-5 min-w-0"
      >
        <AlumniGroupByFacBarChart />
        <AlumniRegisDonutChart />
      </div>
      <div className="mt-5 w-full flex flex-col lg:flex-row items-stretch gap-5 min-w-0">
        <AlumniGroupByWorkBarChart />
        <AlumniGroupByYear />
      </div>
      <div className="mt-5 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 min-w-0">
        <ProfessorGroupByPosition />
        <SendTextGroupbySender />
        <NewsGroupByType />
      </div>

      <div className="mt-5 w-full flex flex-col lg:flex-row items-stretch gap-5 min-w-0">
        <UserListAndAcconutCanUse />
        <PopularNews />
      </div>

      <ImportDataHistory />
    </div>
  );
};
export default Overviews;
