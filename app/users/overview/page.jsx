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
    <div className="w-full p-5 bg-gray-50 flex flex-col">
      <span className="flex items-center gap-2">
        <ChartBar className="text-blue-500" />
        <p className="text-xl font-bold">รายงานภาพรวมระบบ</p>
      </span>
      <p className="text-gray-700 mt-0.5">
        สรุปสถิติและข้อมูลทุกด้านของระบบศิษย์เก่า
      </p>

      <div className="mt-5 w-full grid lg:grid-cols-5 md:grid-cols-3 gap-3.5">
        <FadeInSection
          className={
            "p-3.5 rounded-lg bg-white flex border border-gray-300 items-start shadow-sm justify-between"
          }
        >
          <span className="flex flex-col">
            <p className="text-sm text-gray-600">ศิษย์เก่าทั้งหมด</p>
            {loadStats ? (
              <Loader2
                size={35}
                className="animate-spin mt-1.5 text-blue-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold mt-1.5">
                  {stats?.allAlumni?.toLocaleString() || 0}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  ยังไม่ลงทะเบียน {stats?.allNoRegis?.toLocaleString() || 0} คน
                </p>
              </>
            )}
          </span>
          <p className="p-2 rounded-xl h-fit shadow-xs bg-blue-50 text-blue-500">
            <GraduationCap />
          </p>
        </FadeInSection>
        <FadeInSection
          className={
            "p-3.5 rounded-lg bg-white flex border border-gray-300 items-start shadow-sm justify-between"
          }
        >
          <span className="flex flex-col">
            <p className="text-sm text-gray-600">บุคคลากรทั้งหมด</p>
            {loadStats ? (
              <Loader2
                size={35}
                className="animate-spin mt-1.5 text-blue-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold mt-1.5">
                  {stats?.allProfessor?.toLocaleString() || 0}
                </p>
                <p className="text-red-500 text-xs mt-1">
                  ถูกระงับบัญชี{" "}
                  {stats?.allProfessorCanNotUse?.toLocaleString() || 0} คน
                </p>
              </>
            )}
          </span>
          <p className="p-2 rounded-xl h-fit shadow-xs bg-blue-50 text-blue-500">
            <Users />
          </p>
        </FadeInSection>
        <FadeInSection
          className={
            "p-3.5 rounded-lg bg-white flex border border-gray-300 items-start shadow-sm justify-between"
          }
        >
          <span className="flex flex-col">
            <p className="text-sm text-gray-600">ผู้ดูแล</p>
            {loadStats ? (
              <Loader2
                size={35}
                className="animate-spin mt-1.5 text-blue-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold mt-1.5">
                  {stats?.allAdmin?.toLocaleString() || 0}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  ถูกระงับบัญชี {stats?.allAdminCanotUse?.toLocaleString() || 0}{" "}
                  คน
                </p>
              </>
            )}
          </span>
          <p className="p-2 rounded-xl h-fit shadow-xs bg-blue-50 text-blue-500">
            <UserCog />
          </p>
        </FadeInSection>
        <FadeInSection
          className={
            "p-3.5 rounded-lg bg-white flex border border-gray-300 items-start shadow-sm justify-between"
          }
        >
          <span className="flex flex-col">
            <p className="text-sm text-gray-600">
              ศิษย์เก่ารอตรวจสอบการลงทะเบียน
            </p>
            {loadStats ? (
              <Loader2
                size={35}
                className="animate-spin mt-1.5 text-blue-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold mt-1.5">
                  {stats?.allAlumniPending?.toLocaleString() || 0}
                </p>
                <p className="text-xs mt-1 text-red-500">
                  การชำระถูกปฏิเสธ{" "}
                  {stats?.allAlumniRefuse?.toLocaleString() || 0} คน
                </p>
              </>
            )}
          </span>
          <p className="p-2 rounded-xl h-fit shadow-xs bg-amber-50 text-amber-500">
            <Clock />
          </p>
        </FadeInSection>
        <FadeInSection
          className={
            "p-3.5 rounded-lg bg-white flex border border-gray-300 items-start shadow-sm justify-between"
          }
        >
          <span className="flex flex-col">
            <p className="text-sm text-gray-600">
              ข่าวสาร/กิจกรรม/โครงการบริจาค
            </p>
            {loadStats ? (
              <Loader2
                size={35}
                className="animate-spin mt-1.5 text-blue-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold mt-1.5">
                  {stats?.allNews?.toLocaleString() || 0}
                </p>
              </>
            )}
          </span>
          <p className="p-2 rounded-xl h-fit shadow-xs bg-blue-50 text-blue-500">
            <Newspaper />
          </p>
        </FadeInSection>
        <FadeInSection
          className={
            "p-3.5 rounded-lg bg-white flex border border-gray-300 items-start shadow-sm justify-between"
          }
        >
          <span className="flex flex-col">
            <p className="text-sm text-gray-600">ยอดการเข้าชมข่าวทั้งหมด</p>
            {loadStats ? (
              <Loader2
                size={35}
                className="animate-spin mt-1.5 text-blue-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold mt-1.5">
                  {stats?.allNewsViews?.toLocaleString() || 0}
                </p>
              </>
            )}
          </span>
          <p className="p-2 rounded-xl h-fit shadow-xs bg-blue-50 text-blue-500">
            <Eye />
          </p>
        </FadeInSection>
        <FadeInSection
          className={
            "p-3.5 rounded-lg bg-white flex border border-gray-300 items-start shadow-sm justify-between"
          }
        >
          <span className="flex flex-col">
            <p className="text-sm text-gray-600">ยอดเงินบริจาคสะสม</p>
            {loadStats ? (
              <Loader2
                size={35}
                className="animate-spin mt-1.5 text-blue-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold mt-1.5">
                  {stats?.allCurrentMoney?.toLocaleString() || 0}
                </p>
              </>
            )}
          </span>
          <p className="p-2 rounded-xl h-fit shadow-xs bg-red-50 text-red-500">
            <HeartHandshake />
          </p>
        </FadeInSection>
        <FadeInSection
          className={
            "p-3.5 rounded-lg bg-white flex border border-gray-300 items-start shadow-sm justify-between"
          }
        >
          <span className="flex flex-col">
            <p className="text-sm text-gray-600">ประวัติการส่งข้อความ</p>
            {loadStats ? (
              <Loader2
                size={35}
                className="animate-spin mt-1.5 text-blue-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold mt-1.5">
                  {stats?.allSendText?.toLocaleString() || 0}
                </p>
              </>
            )}
          </span>
          <p className="p-2 rounded-xl h-fit shadow-xs bg-blue-50 text-blue-500">
            <Send />
          </p>
        </FadeInSection>
        <FadeInSection
          className={
            "p-3.5 rounded-lg bg-white flex border border-gray-300 items-start shadow-sm justify-between"
          }
        >
          <span className="flex flex-col">
            <p className="text-sm text-gray-600">การนำเข้าข้อมูลศิษย์เก่า</p>
            {loadStats ? (
              <Loader2
                size={35}
                className="animate-spin mt-1.5 text-blue-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold mt-1.5">
                  {stats?.allImportAlumni?.toLocaleString() || 0}
                </p>
              </>
            )}
          </span>
          <p className="p-2 rounded-xl h-fit shadow-xs bg-blue-50 text-blue-500">
            <Database />
          </p>
        </FadeInSection>
        <FadeInSection
          className={
            "p-3.5 rounded-lg bg-white flex border border-gray-300 items-start shadow-sm justify-between"
          }
        >
          <span className="flex flex-col">
            <p className="text-sm text-gray-600">การนำเข้าข้อมูลบุคคลากร</p>
            {loadStats ? (
              <Loader2
                size={35}
                className="animate-spin mt-1.5 text-blue-500"
              />
            ) : (
              <>
                <p className="text-2xl font-bold mt-1.5">
                  {stats?.allImportPersonel?.toLocaleString() || 0}
                </p>
              </>
            )}
          </span>
          <p className="p-2 rounded-xl h-fit shadow-xs bg-blue-50 text-blue-500">
            <Database />
          </p>
        </FadeInSection>
      </div>

      <div
        id="#alumni"
        className="mt-5 w-full flex flex-col lg:flex-row items-center gap-5"
      >
        <AlumniGroupByFacBarChart />
        <AlumniRegisDonutChart />
      </div>
      <div className="mt-5 w-full flex flex-col lg:flex-row items-center gap-5">
        <AlumniGroupByWorkBarChart />
        <AlumniGroupByYear />
      </div>
      <div className="mt-5 w-full flex flex-col lg:flex-row items-center gap-5">
        <ProfessorGroupByPosition />
        <SendTextGroupbySender />
        <NewsGroupByType />
      </div>

      <div className="mt-5 w-full flex flex-col lg:flex-row items-center gap-5">
        <UserListAndAcconutCanUse />
        <PopularNews />
      </div>

      <ImportDataHistory />
    </div>
  );
};
export default Overviews;
