"use client";
import { NO_PROFILE_IMG } from "@/app/users/profile/alumni-profile";
import SafeImage from "@/components/safe-image";
import { apiConfig } from "@/config/api.config";
import useGetSession from "@/hook/useGetSeesion";
import { alerts } from "@/libs/alerts";
import axios from "axios";
import {
  BriefcaseBusiness,
  ChartArea,
  ChartPie,
  CircleUser,
  Cog,
  GraduationCap,
  HelpCircle,
  ListCheck,
  LogOut,
  MenuIcon,
  MessageCircle,
  Newspaper,
  Search,
  ShieldUser,
  UserCog,
  UserPen,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const Menu = () => {
  const path = usePathname();
  const { user } = useGetSession();
  const router = useRouter();

  const menus = [
    {
      title: "ภาพรวม",
      icon: <ChartPie size={20} />,
      url: "/users/dashboard",
      allowed: [2, 3, 4],
    },
    {
      title: "รายงาน",
      icon: <ChartArea size={20} />,
      url: "/users/overview",
      allowed: [4, 5],
    },
    {
      title: "โปรไฟล์",
      icon: <UserPen size={20} />,
      url: "/users/profile",
      allowed: [1, 2, 3, 4],
    },
    {
      title: "ความเป็นส่วนตัว",
      icon: <ShieldUser size={20} />,
      url: "/users/privacy",
      allowed: [1],
    },
    {
      title: "ประวัติการทำงาน",
      icon: <BriefcaseBusiness size={20} />,
      url: "/users/work-history",
      allowed: [1],
    },
    {
      title: "ค้นหา",
      icon: <Search size={20} />,
      url: "/users/search",
      allowed: [1, 2, 3, 4],
    },
    {
      title: "ข่าวสาร/บริจาค",
      icon: <Newspaper size={20} />,
      url: "/users/news",
      allowed: [1, 2],
    },
    {
      title: "ลงทะเบียนศิษย์เก่า",
      icon: <ListCheck size={20} />,
      url: "/alumni-president/manage-alumni-regis",
      allowed: [5],
    },
    {
      title: "จัดการศิษย์เก่า",
      icon: <GraduationCap size={20} />,
      url: "/alumni-president/alumni-manage",
      allowed: [5],
    },
    {
      title: "จัดการบุคลากร",
      icon: <Users size={20} />,
      url: "/alumni-president/personels-manage",
      allowed: [5],
    },
    {
      title: "จัดการผู้ดูแล",
      icon: <UserCog size={20} />,
      url: "/alumni-president/admin-manage",
      allowed: [5],
    },
    {
      title: "ส่งข้อความ",
      icon: <MessageCircle size={20} />,
      url: user?.roleId === 5 ? "/alumni-president/message" : "/users/message",
      allowed: [2, 3, 4, 5],
    },
    {
      title: "ข่าวสาร/การบริจาค",
      icon: <Newspaper size={20} />,
      url: "/alumni-president/alumni-news",
      allowed: [5],
    },
    {
      title: "บัญชี",
      icon: <CircleUser size={20} />,
      url: user?.roleId === 5 ? "/alumni-president/account" : "/users/account",
      allowed: [1, 2, 3, 4, 5],
    },
    // {
    //   title: "ช่วยเหลือ",
    //   icon: <HelpCircle size={20} />,
    //   url: "/users/help",
    //   allowed: [1, 2, 3, 4],
    // },
    // {
    //   title: "ช่วยเหลือ",
    //   icon: <HelpCircle size={20} />,
    //   url: "/alumni-president/help",
    //   allowed: [5],
    // },
  ];

  const [showResponsive, setShowResponsive] = useState(false);

  const logout = async () => {
    const { isConfirmed } = await alerts.confirmDialog(
      "ออกจากระบบ",
      "ต้องการออกจากระบบหรือไม่?",
      "ออกจากระบบ",
    );
    if (!isConfirmed) return;

    try {
      const res = await axios.get(apiConfig.rmuAPI + "/auth/log-out", {
        withCredentials: true,
      });
      if (res?.status === 200) {
        alerts.success("ออกจากระบบแล้ว!");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {showResponsive && (
        <div
          onClick={() => setShowResponsive(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <div
        className={`p-3 bg-linear-200 from-blue-800 to-blue-950 text-white ${
          showResponsive
            ? "fixed inset-y-0 left-0 w-72 max-w-[85vw] flex z-50 shadow-2xl"
            : "hidden lg:flex lg:w-64 lg:shrink-0"
        } h-full flex-col border-r border-blue-900/40 justify-between overflow-y-auto z-40 transition-transform`}
      >
        <div className="w-full flex flex-col min-h-0">
          <div className="flex items-center w-full gap-3 pb-3 p-1 border-b border-gray-200/40 relative">
            <Link
              href={user?.roleId === 5 ? "/alumni-president/account" : "/users/profile"}
              onClick={() => setShowResponsive(false)}
              className="w-[44px] h-[44px] shrink-0 overflow-hidden rounded-full border-2 border-white/40 hover:border-white transition-all shadow-sm"
              title="ข้อมูลบัญชี"
            >
              <SafeImage
                alt="user-profile"
                src={
                  user?.profile
                    ? apiConfig.imgAPI + user?.profile
                    : NO_PROFILE_IMG
                }
                type="avatar"
                width={44}
                height={44}
                className="w-full h-full object-cover"
              />
            </Link>

            <span className="flex flex-col text-blue-200 text-sm overflow-hidden flex-1 min-w-0">
              <p className="text-xs text-blue-300">ยินดีต้อนรับ!</p>
              <p className="font-semibold text-white truncate text-sm">
                {user?.fname ? `คุณ${user?.fname}` : "คุณผู้ดูแล"}
              </p>
            </span>
            {showResponsive && (
              <button
                onClick={() => setShowResponsive(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
                aria-label="ปิดเมนู"
              >
                <X size={22} />
              </button>
            )}
          </div>
          <label htmlFor="" className="mt-3 mb-1 text-xs font-semibold text-blue-300/80 uppercase tracking-wider">
            เมนูหลัก
          </label>
          <div className="space-y-0.5">
            {menus
              .filter((m) => m.allowed.includes(user?.roleId))
              .map((m, index) => (
                <Link
                  onClick={() => setShowResponsive(false)}
                  key={index}
                  className={`flex items-center gap-3 transition-all text-gray-200 text-sm duration-200 ${
                    path.split("/")[2] === m.url.split("/")[2]
                      ? "border-l-4 border-l-blue-400 bg-white/20 font-medium text-white shadow-xs"
                      : "hover:bg-white/10 hover:text-white rounded-sm"
                  } w-full px-3 py-2.5 rounded-r-md`}
                  href={m.url}
                >
                  <span className="shrink-0">{m.icon}</span>
                  <span className="truncate">{m.title}</span>
                </Link>
              ))}
          </div>

          <label htmlFor="" className="mt-4 mb-1 text-xs font-semibold text-blue-300/80 uppercase tracking-wider">
            ระบบ
          </label>
          <button
            onClick={logout}
            className="flex items-center text-sm gap-3 shadow-xs text-red-300 bg-red-500/20 hover:text-white transition-all duration-200 hover:bg-red-600 rounded-lg w-full px-3 py-2.5 mt-1"
          >
            <LogOut size={18} className="shrink-0" />
            <p className="truncate">ออกจากระบบ</p>
          </button>
        </div>
      </div>

      {/* Mobile Floating Menu Toggle Button */}
      {!showResponsive && (
        <button
          onClick={() => setShowResponsive(true)}
          aria-label="เปิดเมนู"
          className="lg:hidden inline-flex items-center justify-center fixed z-40 bg-white/95 backdrop-blur-xs text-gray-700 shadow-md border border-gray-200 top-2.5 right-3.5 p-2 rounded-xl hover:bg-blue-50 active:scale-95 transition-all"
        >
          <MenuIcon size={22} />
        </button>
      )}
    </>
  );
};
export default Menu;
