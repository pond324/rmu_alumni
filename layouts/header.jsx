import useGetSession from "@/hook/useGetSeesion";
import {
  Building,
  GraduationCap,
  Loader2,
  University,
  User,
  UserCog,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { FaChalkboardTeacher } from "react-icons/fa";

const AppHeader = () => {
  const pathName = usePathname();
  const { user } = useGetSession();
  const role = 3;

  const menus = [
    {
      title: "ภาพรวม",
      url: "/users/dashboard",
    },
    {
      title: "รายงาน",
      url: "/users/overview",
    },
    {
      title: "โปรไฟล์",
      url: "/users/profile",
    },
    {
      title: "ความเป็นส่วนตัว",
      url: "/users/privacy",
    },
    {
      title: "ประวัติการทำงาน",
      url: "/users/work-history",
    },
    {
      title: "ค้นหา",
      url: "/users/search",
    },
    {
      title: "ข่าวสาร/บริจาค",
      url: "/users/news",
    },
    {
      title: "จัดการศิษย์เก่า",
      url: "/alumni-president/alumni-manage",
    },
    {
      title: "จัดการบุคคลการ",
      url: "/alumni-president/personels-manage",
    },
    {
      title: "ส่งข้อความ",
      url: user?.roleId === 5 ? "/alumni-president/message" : "/users/message",
    },
    {
      title: "บัญชี",
      url: "/users/account",
    },
    {
      title: "ข่าวสาร/การบริจาค",
      url: "/alumni-president/alumni-news",
    },
 
  ];

  return (
    <header className="w-full p-3.5 border-b border-gray-200 shadow-md flex items-center justify-between">
      <h1 className="font-bold text-xl text-blue-500">
        {
          menus.find((m) => m.url.split("/")[2] === pathName.split("/")[2])
            .title || ""
        }
      </h1>
      <span className="flex items-center text-sm gap-2 p-1.5 px-2.5 rounded-full border border-gray-300 shadow-sm">
        {user?.roleId === 1 ? (
          <>
            {" "}
            <GraduationCap size={18} color="blue" />
            <p>ศิษย์เก่า</p>
          </>
        ) : user?.roleId === 2 ? (
          <>
            {" "}
            <User size={18} color="blue" />
            <p>อาจารย์</p>
          </>
        ) : user?.roleId === 3 ? (
          <>
            {" "}
            <Building size={18} color="blue" />
            <p>คณบดี</p>
          </>
        ) : user?.roleId === 4 ? (
          <>
            {" "}
            <University size={18} color="blue" />
            <p>อธิการบดี</p>
          </>
        ) : user?.roleId === 5 ? (
          <>
            {" "}
            <UserCog size={18} color="blue" />
            <p>ผู้ดูแลระบบ</p>
          </>
        ) : (
          <>
            {" "}
            <Loader2 className="animate-spin" color="blue" size={18} />
            <p>ตรวจสอบสิทธิ์...</p>
          </>
        )}
      </span>
    </header>
  );
};
export default AppHeader;
