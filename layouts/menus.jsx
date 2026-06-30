"use client";
import { NO_PROFILE_IMG } from "@/app/users/profile/alumni-profile";
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
      allowed: [4,5],
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
    // {
    //   title: "ลงทะเบียนศิษย์เก่า",
    //   icon: <ListCheck size={20} />,
    //   url: "/alumni-president/manage-alumni-regis",
    //   allowed: [5],
    // },
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
      title: "บัญชี",
      icon: <CircleUser size={20} />,
      url: "/users/account",
      allowed: [1, 2, 3, 4],
    },
    {
      title: "ข่าวสาร/การบริจาค",
      icon: <Newspaper size={20} />,
      url: "/alumni-president/alumni-news",
      allowed: [5],
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
      <div
        className={`p-3 bg-linear-200 from-blue-800 to-blue-950 lg:flex bg-white ${
          showResponsive ? "flex w-[80%] absolute top-0" : "hidden"
        } w-1/6 h-full flex-col border-r-2 justify-between border-gray-200 shadow-md z-20`}
      >
        <div className="w-full flex flex-col">
          <div className="flex items-center w-full gap-4 pb-3 p-1 border-b border-gray-200">
            {user?.roleId < 5 && (
              <Link
                href="/users/profile"
                className="w-[50px] h-[50px] overflow-hidden rounded-full border border-gray-300"
              >
                <img
                  alt="user-profile"
                  src={
                    user?.profile
                      ? apiConfig.imgAPI + user?.profile
                      : NO_PROFILE_IMG
                  }
                  width={50}
                  height={50}
                  className="w-full h-full object-cover"
                />
              </Link>
            )}

            <span className="flex flex-col text-blue-200 text-sm">
              <p className="">ยินดีต้อนรับ!</p>
              <p className="">คุณ{user?.fname}</p>
            </span>
            {showResponsive && (
              <button
                onClick={() => setShowResponsive(false)}
                className="absolute top-3 right-5"
              >
                <X size={28} />
              </button>
            )}
          </div>
          <label htmlFor="" className="my-4 text-sm text-gray-300">
            เมนู
          </label>
          {menus
            .filter((m) => m.allowed.includes(user?.roleId))
            .map((m, index) => (
              <Link
                onClick={() => setShowResponsive(false)}
                key={index}
                className={`flex items-center gap-3 transition-all text-gray-300 text-sm duration-300 ${
                  path.split("/")[2] === m.url.split("/")[2]
                    ? "border-l-4 border-l-gray-100 bg-white/25"
                    : "hover:bg-white/15 hover:shadow-xs rounded-sm "
                }  mt-0.5 w-full px-3.5 py-3`}
                href={m.url}
              >
                {m.icon}
                {m.title}
              </Link>
            ))}
          <label htmlFor="" className="my-4 text-sm text-gray-300">
            ระบบ
          </label>
          {user?.roleId == 5 && (
            <Link
              className={`flex items-center gap-3 transition-all text-gray-300 text-sm duration-300 ${
                path.split("/")[2] === "setting"
                  ? "border-l-4 border-l-gray-100 bg-white/25"
                  : "hover:bg-white/15 hover:shadow-xs "
              }  mt-0.5 rounded-lg w-full px-3.5 py-3`}
              href={"/alumni-president/setting/regis"}
            >
              <Cog className="" size={18} />
              <p>ตั้งค่าระบบ</p>
            </Link>
          )}
          <button
            onClick={logout}
            className="flex items-center text-sm gap-3 shadow-sm text-red-500 bg-red/15  hover:text-gray-100 transition-all duration-300 hover:bg-red-500 mt-1 rounded-lg w-full px-3.5 py-3"
          >
            <LogOut size={20} />
            <p>ออกจากระบบ</p>
          </button>
        </div>

        {/* developby */}
      </div>

      {/* responsive button */}
      <button
        onClick={() => setShowResponsive(!showResponsive)}
        className="lg:hidden inline fixed z-[100] bg-white top-3 right-5 p-1.5 rounded-full hover:bg-blue-200"
      >
        <MenuIcon size={28} />
      </button>
    </>
  );
};
export default Menu;
